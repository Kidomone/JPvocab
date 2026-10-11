from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.word import WordCreate, WordUpdate, WordResponse
from app.crud.crud_user import get_user_by_id
from app.crud.crud_word import (
    get_word_by_id,
    get_words,
    create_word,
    update_word,
    delete_word,
)

router = APIRouter()


@router.post("/", response_model=WordResponse, status_code=status.HTTP_201_CREATED)
def add_word_to_vocabulary(word_in: WordCreate, db: Session = Depends(get_db)):
    user = get_user_by_id(db, word_in.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {word_in.user_id} does not exist",
        )
    return create_word(db, word_in)


@router.get("/", response_model=List[WordResponse])
def list_words(
    user_id: Optional[int] = Query(None, description="Filter words by user ID"),
    search: Optional[str] = Query(None, description="Search keyword in word, reading, meaning, or notes"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return get_words(
        db=db,
        user_id=user_id,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/{word_id}", response_model=WordResponse)
def get_single_word(word_id: int, db: Session = Depends(get_db)):
    db_word = get_word_by_id(db, word_id)
    if not db_word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found",
        )
    return db_word


@router.patch("/{word_id}", response_model=WordResponse)
def update_word_entry(word_id: int, word_in: WordUpdate, db: Session = Depends(get_db)):
    db_word = get_word_by_id(db, word_id)
    if not db_word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found",
        )
    return update_word(db, db_word, word_in)


@router.delete("/{word_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_word_entry(word_id: int, db: Session = Depends(get_db)):
    db_word = get_word_by_id(db, word_id)
    if not db_word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found",
        )
    delete_word(db, db_word)
    return None
