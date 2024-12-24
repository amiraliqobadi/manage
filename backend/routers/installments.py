from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from database import engine
from datetime import datetime
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal
from models import Installments  
import models
router = APIRouter(prefix="/installments", tags=["installments"])
models.Base.metadata.create_all(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class InstallmentCreate(BaseModel):
    amount: int
    frequency: int
    start_date: datetime  
    end_date: datetime    

class InstallmentDisplay(InstallmentCreate):
    id: int

    class Config:
        orm_mode = True

@router.post("/", response_model=InstallmentDisplay)  
def create_installment(installment: InstallmentCreate, db: Session = Depends(get_db)):
    db_installment = Installments(
        amount=installment.amount,
        frequency=installment.frequency,
        start_date=installment.start_date,
        end_date=installment.end_date
    )
    db.add(db_installment)
    db.commit()
    db.refresh(db_installment)
    return db_installment

@router.get("/", response_model=list[InstallmentDisplay]) 
def read_installments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    installments = db.query(Installments).offset(skip).limit(limit).all()
    return installments

@router.delete("/{id}")  
def delete_installment(id: int, db: Session = Depends(get_db)):
    installment = db.query(Installments).filter(Installments.id == id)
    if installment.first() is None:
        raise HTTPException(status_code=404, detail="Installment not found")
    
    installment.delete()
    db.commit()
    return {"message": "Installment deleted successfully"}
