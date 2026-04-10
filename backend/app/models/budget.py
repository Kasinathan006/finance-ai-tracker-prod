import uuid
from sqlalchemy import Column, String, ForeignKey, Float, DateTime, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    amount = Column(Float, nullable=False)
    period = Column(String, default="monthly") # monthly, yearly
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="budgets")
    category = relationship("Category")

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(DateTime, nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="savings_goals")
