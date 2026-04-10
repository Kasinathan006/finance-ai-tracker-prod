import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    icon = Column(String, nullable=True) # Lucide icon name
    color = Column(String, nullable=True) # HEX color
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True) # Null for global defaults

    transactions = relationship("Transaction", back_populates="category")

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # Cash, Bank, Credit Card, etc.
    balance = Column(Float, default=0.0)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)

    transactions = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    type = Column(String, nullable=False) # income, expense, transfer
    
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False)
    account_id = Column(String(36), ForeignKey("accounts.id"), nullable=False)

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")
