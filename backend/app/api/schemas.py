from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, UUID4

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    email: Optional[str] = None

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: str
    user_id: Optional[str]

    class Config:
        from_attributes = True

# Account Schemas
class AccountBase(BaseModel):
    name: str
    type: str
    balance: float = 0.0

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    description: Optional[str] = None
    date: datetime
    type: str # income, expense, transfer
    category_id: str
    account_id: str

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    type: Optional[str] = None
    category_id: Optional[str] = None
    account_id: Optional[str] = None

class TransactionOut(TransactionBase):
    id: str
    user_id: str
    category: Category
    account: Account

    class Config:
        from_attributes = True

# Budget Schemas
class BudgetBase(BaseModel):
    amount: float
    period: str = "monthly"
    category_id: str

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    amount: Optional[float] = None
    period: Optional[str] = None
    category_id: Optional[str] = None

class Budget(BudgetBase):
    id: str
    user_id: str
    category: Category
    spent: float = 0.0

    class Config:
        from_attributes = True

# Savings Goal Schemas
class SavingsGoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: Optional[datetime] = None

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[datetime] = None

class SavingsGoal(SavingsGoalBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True
