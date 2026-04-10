from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.budget import Budget, SavingsGoal
from app.api import schemas

router = APIRouter()

from sqlalchemy import func
from app.models.transaction import Transaction

# Budgets
@router.get("/", response_model=List[schemas.Budget])
def read_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    
    # Calculate spent for each budget (for the current month)
    now = datetime.now()
    start_of_month = datetime(now.year, now.month, 1)
    
    for budget in budgets:
        spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.category_id == budget.category_id,
            Transaction.type == "expense",
            Transaction.date >= start_of_month
        ).scalar() or 0.0
        budget.spent = abs(spent)
        
    return budgets

@router.post("/", response_model=schemas.Budget)
def create_budget(
    budget: schemas.BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if a budget for this category already exists
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category_id == budget.category_id
    ).first()
    
    if existing:
        existing.amount = budget.amount
        existing.period = budget.period
        db.commit()
        db.refresh(existing)
        return existing

    db_budget = Budget(**budget.dict(), user_id=current_user.id)
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.delete("/{budget_id}")
def delete_budget(
    budget_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    db.delete(db_budget)
    db.commit()
    return {"message": "Budget deleted"}

# Savings Goals
@router.get("/savings", response_model=List[schemas.SavingsGoal])
def read_savings_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(SavingsGoal).filter(SavingsGoal.user_id == current_user.id).all()

@router.post("/savings", response_model=schemas.SavingsGoal)
def create_savings_goal(
    goal: schemas.SavingsGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = SavingsGoal(**goal.dict(), user_id=current_user.id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.patch("/savings/{goal_id}", response_model=schemas.SavingsGoal)
def update_savings_goal(
    goal_id: str,
    goal_in: schemas.SavingsGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    
    update_data = goal_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_goal, field, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal
