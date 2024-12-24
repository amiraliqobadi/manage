from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base
import pytz
from datetime import datetime
tehran_tz = pytz.timezone("Asia/Tehran")

class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, index=True)
    userName = Column(String, nullable=True)
    fullName = Column(String)
    hashedPassword = Column(String)

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    shop = Column(String, nullable=True)
    category = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(tehran_tz),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(tehran_tz),
        onupdate=lambda: datetime.now(tehran_tz),
        nullable=True,
    )

    images = relationship("Image", back_populates="card", cascade="all, delete-orphan")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
    card = relationship("Card", back_populates="images")
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class Installments(Base):
    __tablename__ = "installments"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
    frequency = Column(Integer, nullable=False)

class Check(Base):
    __tablename__ = "checks"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=True)
    check_number = Column(Integer, nullable=True)
    bank = Column(String, nullable=True)
    date = Column(DateTime(timezone=True), server_default=func.now())

class DayIncome(Base):
    __tablename__ = "day_incomes"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=True, default=40)
    date = Column(DateTime(timezone=True), server_default=func.now())