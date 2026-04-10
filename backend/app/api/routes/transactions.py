from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.transaction import Transaction, Category, Account
from app.api.schemas import TransactionCreate, TransactionOut, TransactionUpdate, Category as CategorySchema, Account as AccountSchema

router = APIRouter()

# Categories
@router.get("/categories", response_model=List[CategorySchema])
def read_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get global defaults + user specific categories
    return db.query(Category).filter((Category.user_id == None) | (Category.user_id == current_user.id)).all()

# Accounts
@router.get("/accounts", response_model=List[AccountSchema])
def read_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Account).filter(Account.user_id == current_user.id).all()

@router.post("/accounts", response_model=AccountSchema)
def create_account(
    account: AccountSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_account = Account(**account.dict(), user_id=current_user.id)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

# Transactions
@router.get("/", response_model=List[TransactionOut])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    category_id: Optional[str] = None,
    account_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if account_id:
        query = query.filter(Transaction.account_id == account_id)
        
    return query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()

@router.post("/", response_model=TransactionOut)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = Transaction(**transaction.dict(), user_id=current_user.id)
    db.add(db_transaction)
    
    # Update account balance
    db_account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
        
    if transaction.type == "expense":
        db_account.balance -= transaction.amount
    elif transaction.type == "income":
        db_account.balance += transaction.amount
        
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, 
        Transaction.user_id == current_user.id
    ).first()
    
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    # Revert account balance
    db_account = db.query(Account).filter(Account.id == db_transaction.account_id).first()
    if db_account:
        if db_transaction.type == "expense":
            db_account.balance += db_transaction.amount
        elif db_transaction.type == "income":
            db_account.balance -= db_transaction.amount
            
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}
