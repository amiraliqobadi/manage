from fastapi import (
    APIRouter,
    Depends,
)
from database import engine
from datetime import datetime
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal
from models import Check  # Assuming Check is your SQLAlchemy model
import models

router = APIRouter(prefix="/checks", tags=["checks"])
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CheckCreate(BaseModel):
    amount: int
    check_number: int
    bank: str
    date: datetime 


class CheckDisplay(CheckCreate):
    id: int

    class Config:
        orm_mode = True

@router.post("/", response_model=CheckDisplay)
def create_check(check: CheckCreate, db: Session = Depends(get_db)):
    db_check = Check(
        amount=check.amount,
        check_number=check.check_number,
        bank=check.bank,
        date=check.date
    )
    db.add(db_check)
    db.commit()
    db.refresh(db_check)
    return db_check


@router.get("/", response_model=list[CheckDisplay])
def read_checks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    checks = db.query(Check).offset(skip).limit(limit).all()
    return checks



@router.delete("/{check_id}", response_model=CheckDisplay)
def delete_check(check_id: int, db: Session = Depends(get_db)):
    db_check = db.query(Check).filter(Check.id == check_id).first()  # Execute the query
    if db_check is None:
        raise HTTPException(status_code=404, detail="Check not found")
    
    db.delete(db_check)  
    db.commit()
    return db_check 

