from fastapi import APIRouter

from app.api.words import router as words_router
from app.api.users import router as users_router
from app.api.analyze import router as analyze_router

api_router = APIRouter()

api_router.include_router(words_router, prefix="/words", tags=["words"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(analyze_router, tags=["analysis"])
