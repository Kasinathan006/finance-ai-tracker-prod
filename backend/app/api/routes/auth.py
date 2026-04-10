from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.user import User
from app.api.schemas import UserCreate, UserOut, Token, TokenData

router = APIRouter()

from app.api.deps import get_current_user

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )
    
    from app.models.transaction import Category, Account
    
    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Seed default categories
    default_categories = [
        {"name": "Food", "icon": "Utensils", "color": "#ef4444"},
        {"name": "Transport", "icon": "Car", "color": "#3b82f6"},
        {"name": "Rent", "icon": "Home", "color": "#8b5cf6"},
        {"name": "Salary", "icon": "DollarSign", "color": "#10b981"},
        {"name": "Entertainment", "icon": "Film", "color": "#f59e0b"},
        {"name": "Others", "icon": "MoreHorizontal", "color": "#64748b"},
    ]
    
    for cat in default_categories:
        db_cat = Category(**cat, user_id=db_user.id)
        db.add(db_cat)
    
    # Seed default account
    db_account = Account(name="Main Account", type="Bank", balance=0.0, user_id=db_user.id)
    db.add(db_account)
    
    db.commit()
    return db_user

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(email: str):
    return {"message": "If the email is registered, you will receive a reset link."}
