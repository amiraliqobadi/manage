from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from models import Installments, Check, DayIncome, Card 
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class DateRange(BaseModel):
    start_date: str
    end_date: str

class CashFlow(BaseModel):
    inflows: int
    outflows: int
    net_cash_flow: int
    
router = APIRouter(prefix="/cash-flow", tags=["cash-flow"])

@router.post("/", response_model=CashFlow)
async def calculate_cash_flow(date_range: DateRange, db: Session = Depends(get_db)):
    start_date = datetime.strptime(date_range.start_date, "%Y-%m-%d")
    end_date = datetime.strptime(date_range.end_date, "%Y-%m-%d")

    checks_query = db.query(Check).filter(Check.date >= start_date, Check.date <= end_date)
    total_check_amount = sum(check.amount for check in checks_query.all())

    day_incomes_query = db.query(DayIncome).filter(DayIncome.date >= start_date, DayIncome.date <= end_date)
    total_day_income = sum(day_income.amount for day_income in day_incomes_query.all())

    inflows = total_check_amount + total_day_income

    installments_query = db.query(Installments).filter(Installments.start_date >= start_date, Installments.end_date <= end_date)
    total_installment_amount = sum(installment.amount * installment.frequency for installment in installments_query.all())

    cards_query = db.query(Card).filter(Card.created_at >= start_date, Card.created_at <= end_date)
    total_card_amount = sum(card.amount for card in cards_query.all())

    outflows = total_installment_amount + total_card_amount

    net_cash_flow = inflows - outflows

    return CashFlow(inflows=inflows, outflows=outflows, net_cash_flow=net_cash_flow)