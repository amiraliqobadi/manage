from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field
from typing import Literal, Optional, Dict
from starlette import status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import JWTError, jwt


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def validate_password(password: str) -> bool:
    return True


router = APIRouter(prefix="/auth", tags=["auth"])
SECRET_KEY = "197b2c37c391bed93fe80344fe73b806947a65e36206e05a1a23c2fa12702fe3"
ALGORITHM = "HS256"
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/access-token")


def get_current_user(
    token: str = Depends(oauth2_bearer), db: Session = Depends(get_db)
) -> Optional[dict]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.userName == user_id).first()
    if user is None:
        raise credentials_exception
    return {"id": user.id, "username": user.userName}


class CreateUserRequest(BaseModel):
    userName: str
    fullName: Optional[str] = None
    hashedPassword: str


def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.userName == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashedPassword):
        return False
    return user


def create_access_token(data: Dict[str, str]) -> str:
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
    request: Request,
    create_user_request: CreateUserRequest,
    db: Session = Depends(get_db),
):
    if validate_password(create_user_request.hashedPassword) is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Enter valid Password. Password should contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and should be 8-20 characters long.",
        )
    create_user_model = User(
        userName=create_user_request.userName,
        fullName=create_user_request.fullName,
        hashedPassword=bcrypt_context.hash(create_user_request.hashedPassword),
    )
    db.add(create_user_model)
    db.commit()


@router.post("/access-token")
def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.userName, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(request: Request, response: Response):
    response.status_code = status.HTTP_200_OK
    response.delete_cookie("Authorization")
    response.headers["WWW-Authenticate"] = "Bearer"
    return {"detail": "Successfully logged out"}
