from fastapi import FastAPI, Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database import SessionLocal
from models import DayIncome

# Pydantic Models
class DayIncomeCreate(BaseModel):
    amount: int
    date: Optional[datetime] = datetime.now()

class DayIncomeDisplay(DayIncomeCreate):
    id: int
    class Config:
        orm_mode = True

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Router for day incomes
router = APIRouter(prefix="/day_incomes", tags=["day_incomes"])

@router.post("/", response_model=DayIncomeDisplay)
def create_day_income(day_income: DayIncomeCreate, db: Session = Depends(get_db)):
    new_income = DayIncome(
        amount=day_income.amount,
        date=day_income.date or datetime.utcnow(),
    )
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income

@router.get("/", response_model=list[DayIncomeDisplay])
def read_day_incomes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    day_incomes = db.query(DayIncome).offset(skip).limit(limit).all()
    return day_incomes

@router.delete("/{id}")
async def delete_day_income(id: int):
    db = SessionLocal()
    try:
        db_day_income = db.query(DayIncome).filter(DayIncome.id == id).first()
        if db_day_income is None:
            raise HTTPException(status_code=404, detail="Day Income not found")
        db.delete(db_day_income)
        db.commit()
        return {"detail": "Day Income deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting day income")
    finally:
        db.close()
