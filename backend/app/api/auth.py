from datetime import datetime, timezone
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    RefreshTokenRequest,
    RevokeTokenRequest,
    RevokeResponse,
)
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.api.deps import get_current_user
from app.crud.crud_user import (
    get_user_by_id,
    get_user_by_username,
    get_user_by_email,
    get_user_by_username_or_email,
    create_user,
)
from app.crud.crud_refresh_token import (
    create_refresh_token_record,
    get_refresh_token,
    revoke_refresh_token,
)
from app.services.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user and issue initial tokens",
)
def register(
    user_in: RegisterRequest,
    db: Session = Depends(get_db),
):
    if get_user_by_username(db, user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{user_in.username}' is already taken",
        )
    if get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{user_in.email}' is already registered",
        )

    new_user = create_user(
        db,
        UserCreate(
            username=user_in.username,
            email=user_in.email,
            password=user_in.password,
        ),
    )

    token_payload = {"sub": str(new_user.id), "username": new_user.username}
    access_token, expires_in = create_access_token(token_payload)
    refresh_token, refresh_expires_at, jti = create_refresh_token(token_payload)

    create_refresh_token_record(
        db=db,
        user_id=new_user.id,
        token=jti,
        expires_at=refresh_expires_at,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in,
        user=new_user,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate user and issue access and refresh tokens",
)
def login(
    login_in: LoginRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_username_or_email(db, login_in.username.strip())
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = {"sub": str(user.id), "username": user.username}
    access_token, expires_in = create_access_token(token_payload)
    refresh_token, refresh_expires_at, jti = create_refresh_token(token_payload)

    create_refresh_token_record(
        db=db,
        user_id=user.id,
        token=jti,
        expires_at=refresh_expires_at,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in,
        user=user,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token using an active refresh token",
)
def refresh_token(
    refresh_in: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    token_str = refresh_in.refresh_token.strip()

    try:
        payload = decode_token(token_str)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or malformed refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type (expected refresh token)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_raw = payload.get("sub")
    if not user_id_raw:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload: missing subject",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(user_id_raw)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload: subject must be user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    jti = payload.get("jti")
    db_token = (get_refresh_token(db, jti) if jti else None) or get_refresh_token(db, token_str)
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if db_token.revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    now = datetime.now(timezone.utc)
    expires_at = db_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if now > expires_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this token not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = {"sub": str(user.id), "username": user.username}
    new_access_token, expires_in = create_access_token(token_payload)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=token_str,
        token_type="bearer",
        expires_in=expires_in,
        user=user,
    )


@router.post(
    "/revoke",
    response_model=RevokeResponse,
    summary="Revoke a refresh token to terminate session renewal",
)
def revoke_token(
    revoke_in: RevokeTokenRequest,
    db: Session = Depends(get_db),
):
    token_str = revoke_in.refresh_token.strip()
    jti = None
    try:
        t_payload = decode_token(token_str)
        jti = t_payload.get("jti")
    except Exception:
        pass

    success = (revoke_refresh_token(db, jti) if jti else False) or revoke_refresh_token(db, token_str)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Refresh token not found",
        )
    return RevokeResponse(
        message="Refresh token has been successfully revoked",
        revoked=True,
    )


@router.post(
    "/logout",
    response_model=RevokeResponse,
    summary="Log out user and revoke session refresh token",
)
def logout(
    logout_in: RevokeTokenRequest,
    db: Session = Depends(get_db),
):
    token_str = logout_in.refresh_token.strip()
    jti = None
    try:
        t_payload = decode_token(token_str)
        jti = t_payload.get("jti")
    except Exception:
        pass

    revoked = (revoke_refresh_token(db, jti) if jti else False) or revoke_refresh_token(db, token_str)
    return RevokeResponse(
        message="Logged out successfully. Session refresh token revoked." if revoked else "Logged out (session was already ended or token not found).",
        revoked=revoked,
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get profile of the currently authenticated user",
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user
