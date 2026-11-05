from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.word import WordCreate, WordUpdate, WordResponse
from app.api.deps import get_current_user
from app.crud.crud_word import (
    get_word_by_id,
    get_words,
    create_word,
    update_word,
    delete_word,
)

router = APIRouter()


@router.post("/", response_model=WordResponse, status_code=status.HTTP_201_CREATED)
def add_word_to_vocabulary(
    word_in: WordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if word_in.user_id is not None and word_in.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add words to another user's vocabulary",
        )
    # Automatically assign current authenticated user
    word_in.user_id = current_user.id
    return create_word(db, word_in)


@router.get("/", response_model=List[WordResponse])
def list_words(
    user_id: Optional[int] = Query(None, description="Filter words by user ID"),
    search: Optional[str] = Query(None, description="Search keyword in word, reading, meaning, or notes"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if user_id is not None and user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view another user's vocabulary",
        )
    return get_words(
        db=db,
        user_id=current_user.id,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/{word_id}", response_model=WordResponse)
def get_single_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_word = get_word_by_id(db, word_id)
    if not db_word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found",
        )
    if db_word.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this word",
        )
    return db_word


@router.patch("/{word_id}", response_model=WordResponse)
def update_word_entry(
    word_id: int,
    word_in: WordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_word = get_word_by_id(db, word_id)
    if not db_word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found",
        )
    if db_word.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this word",
        )
    return update_word(db, db_word, word_in)


@router.delete("/{word_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_word_entry(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_word = get_word_by_id(db, word_id)
    if not db_word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found",
        )
    if db_word.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this word",
        )
    delete_word(db, db_word)
    return None
