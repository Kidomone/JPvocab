from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.refresh_token import RefreshToken


def create_refresh_token_record(
    db: Session,
    user_id: int,
    token: str,
    expires_at: datetime,
) -> RefreshToken:
    """Store a newly issued refresh token in the database."""
    token_record = RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at,
        revoked=False,
    )
    db.add(token_record)
    db.commit()
    db.refresh(token_record)
    return token_record


def get_refresh_token(db: Session, token: str) -> Optional[RefreshToken]:
    """Retrieve a refresh token by its token string."""
    return db.query(RefreshToken).filter(RefreshToken.token == token).first()


def revoke_refresh_token(db: Session, token: str) -> bool:
    """Mark a refresh token as revoked."""
    record = get_refresh_token(db, token)
    if not record:
        return False
    record.revoked = True
    db.commit()
    return True


def revoke_all_user_tokens(db: Session, user_id: int) -> int:
    """Revoke all active refresh tokens for a given user."""
    updated = (
        db.query(RefreshToken)
        .filter(RefreshToken.user_id == user_id, RefreshToken.revoked == False)
        .update({RefreshToken.revoked: True})
    )
    db.commit()
    return updated
