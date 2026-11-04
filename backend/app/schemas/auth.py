from pydantic import BaseModel, Field
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100, description="Username or email")
    password: str = Field(..., min_length=4, max_length=100, description="User password")


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: str = Field(
        ...,
        pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        description="Unique email address",
    )
    password: str = Field(..., min_length=4, max_length=100, description="Password (min 4 characters)")


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="Refresh token for renewing access")
    token_type: str = Field("bearer", description="Token type")
    expires_in: int = Field(..., description="Access token lifetime in seconds")
    user: UserResponse = Field(..., description="Authenticated user info")


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=10, description="Valid refresh token")


class RevokeTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=10, description="Refresh token to revoke")


class RevokeResponse(BaseModel):
    message: str = Field("Token revoked successfully", description="Status message")
    revoked: bool = Field(True, description="Whether token revocation succeeded")
