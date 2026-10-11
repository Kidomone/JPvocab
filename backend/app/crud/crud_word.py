from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.word import Word
from app.schemas.word import WordCreate, WordUpdate

def get_word_by_id(db: Session, word_id: int) -> Optional[Word]:
    return db.query(Word).filter(Word.id == word_id).first()

def get_words(
    db: Session,
    user_id: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Word]:
    query = db.query(Word)
    if user_id is not None:
        query = query.filter(Word.user_id == user_id)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Word.word.ilike(search_filter),
                Word.reading.ilike(search_filter),
                Word.meaning.ilike(search_filter),
                Word.notes.ilike(search_filter),
            )
        )
    return query.order_by(Word.created_at.desc()).offset(skip).limit(limit).all()

def create_word(db: Session, word_in: WordCreate) -> Word:
    db_word = Word(
        user_id=word_in.user_id,
        word=word_in.word.strip(),
        reading=word_in.reading.strip(),
        meaning=word_in.meaning.strip(),
        notes=word_in.notes or "",
    )
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word

def update_word(db: Session, db_word: Word, word_in: WordUpdate) -> Word:
    if word_in.word is not None:
        db_word.word = word_in.word.strip()
    if word_in.reading is not None:
        db_word.reading = word_in.reading.strip()
    if word_in.meaning is not None:
        db_word.meaning = word_in.meaning.strip()
    if word_in.notes is not None:
        db_word.notes = word_in.notes
    db.commit()
    db.refresh(db_word)
    return db_word

def delete_word(db: Session, db_word: Word) -> None:
    db.delete(db_word)
    db.commit()
