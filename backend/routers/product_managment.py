from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Request,
    File,
    UploadFile,
    Form,
)
import os
from fastapi import HTTPException
from starlette import status
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from models import Card, Image
from database import SessionLocal
from pydantic import BaseModel, Field
from .auth import get_current_user
from typing import List, Optional, Annotated
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import func
from fastapi import Query
from datetime import date

router = APIRouter(prefix="/management", tags=["management"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/cards", tags=["cards"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class CardRequest(BaseModel):
    amount: Optional[int] = None
    description: Optional[str] = None
    shop: Optional[str] = None
    category: Optional[str] = None


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_card(
    db: db_dependency,
    request: Request,
    description: str = Form(...),
    shop: str = Form(...),
    category: str = Form(...),
    amount: int = Form(...),
    images: Optional[List[UploadFile]] = File(None),
):
    card = Card(
        description=description,
        shop=shop,
        category=category,
        amount=amount,
    )

    db.add(card)
    db.commit()
    db.refresh(card)

    if images:
        for image in images:

            image_path = f"static/imgs/{image.filename}"

            with open(image_path, "wb") as buffer:
                buffer.write(await image.read())

            image_record = Image(
                image_url=f"/static/imgs/{image.filename}", card_id=card.id
            )
            db.add(image_record)

    db.commit()
    db.refresh(card)
    return jsonable_encoder(
        card,
        include={
            "id",
            "description",
            "shop",
            "category",
            "images",
            "created_at",
            "amount",
        },
    )


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all_cards(
    db: db_dependency,
    shop: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
):
    """
    Get all cards along with their images, filtered by shop, category, and date range.
    """
    # Eagerly load cards with images using joinedload
    query = db.query(Card).options(joinedload(Card.images))

    # Apply shop filter
    if shop:
        query = query.filter(Card.shop == shop)

    # Apply category filter
    if category:
        query = query.filter(Card.category == category)

    # Apply start date filter
    if start_date:
        query = query.filter(Card.created_at >= start_date)

    # Apply end date filter
    if end_date:
        query = query.filter(Card.created_at <= end_date)

    cards = query.all()

    return jsonable_encoder(
        cards,
        include={
            "id",
            "description",
            "shop",
            "category",
            "images",
            "created_at",
            "amount",
        },
    )


@router.put("/{card_id}", status_code=status.HTTP_200_OK)
async def update_card(
    card_id: int,
    card_request: CardRequest,
    db: db_dependency,
    new_images: List[UploadFile] = File(None),
):
    """
    Update an existing card, including the ability to upload new images.
    """
    card = db.query(Card).filter(Card.id == card_id).first()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if card_request.description:
        card.description = card_request.description

    if new_images:
        for image in new_images:
            image_record = Image(
                image_url=f"../imgs/{image.filename}",  #
                shop_id=card.id,
            )
            db.add(image_record)

    card.updated_at = datetime.now()

    db.commit()
    db.refresh(card)

    return jsonable_encoder(card)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(card_id: int, db: db_dependency):
    """
    Delete a card and its associated images from both the database and the file system.
    """
    card = db.query(Card).filter(Card.id == card_id).first()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    images = card.images
    for image in images:
        image_path = "." + image.image_url

        if os.path.exists(image_path):
            os.remove(image_path)
        else:
            print(f"Image file {image_path} not found, skipping deletion.")

    db.delete(card)
    db.commit()

    return {"message": "Card and associated images deleted successfully"}


class CategoryAmount(BaseModel):
    category: str
    total_amount: int

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    categories: List[CategoryAmount]
    total_sum: int


@router.get("/categories", response_model=CategoryResponse)
async def get_categories(
    shop: Optional[str] = None,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Card)

    if shop:
        query = query.filter(Card.shop == shop)

    if start_date:
        try:
            start_date_parsed = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(Card.created_at >= start_date_parsed)
        except ValueError:
            raise HTTPException(
                status_code=400, detail="Invalid start_date format. Use YYYY-MM-DD."
            )

    if end_date:
        try:
            end_date_parsed = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(Card.created_at <= end_date_parsed)
        except ValueError:
            raise HTTPException(
                status_code=400, detail="Invalid end_date format. Use YYYY-MM-DD."
            )

    # Fetch category data and sum amounts per category
    categories = (
        query.with_entities(Card.category, func.sum(Card.amount).label("total_amount"))
        .group_by(Card.category)
        .all()
    )

    # Calculate total sum of all amounts in the filtered date range
    total_sum = query.with_entities(func.sum(Card.amount)).scalar() or 0
    return {
        "categories": jsonable_encoder(
            [
                {
                    "category": category,
                    "total_amount": total_amount or 0,
                }
                for category, total_amount in categories
            ]
        ),
        "total_sum": total_sum,  # Include the total sum in the response
    }