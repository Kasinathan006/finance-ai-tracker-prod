from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.transaction import Transaction, Category
from app.models.budget import Budget

router = APIRouter()

@router.get("/insights")
def get_ai_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch data for analysis
    now = datetime.now()
    start_of_month = datetime(now.year, now.month, 1)
    
    # 1. Total spending this month vs budgets
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    insights = []
    
    over_budget_cats = []
    for budget in budgets:
        spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.category_id == budget.category_id,
            Transaction.type == "expense",
            Transaction.date >= start_of_month
        ).scalar() or 0.0
        spent = abs(spent)
        
        if spent > budget.amount:
            cat_name = db.query(Category.name).filter(Category.id == budget.category_id).scalar()
            over_budget_cats.append(cat_name)
            
    if over_budget_cats:
        insights.append({
            "type": "warning",
            "title": "Budget Alert",
            "message": f"You've exceeded your budget in: {', '.join(over_budget_cats)}. Consider tightening your belt for the rest of the month."
        })

    # 2. Saving suggestion
    # Find most expensive category
    top_expense = db.query(
        Category.name, func.sum(Transaction.amount).label("total")
    ).join(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= start_of_month
    ).group_by(Category.name).order_by(func.sum(Transaction.amount).desc()).first()
    
    if top_expense:
        insights.append({
            "type": "info",
            "title": "Savings Tip",
            "message": f"You spent ${abs(top_expense.total):.2f} on {top_expense.name} so far. Reducing this by 10% could save you ${abs(top_expense.total)*0.1:.2f} this month."
        })

    # 3. Health Score (Draft logic)
    # Income vs Expense ratio
    monthly_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        Transaction.date >= start_of_month
    ).scalar() or 0.0
    
    monthly_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= start_of_month
    ).scalar() or 0.0
    monthly_expense = abs(monthly_expense)
    
    score = 50 # Base
    if monthly_income > 0:
        ratio = monthly_expense / monthly_income
        if ratio < 0.5: score = 90
        elif ratio < 0.8: score = 75
        elif ratio < 1.0: score = 60
        else: score = 40
    
    health_status = "Excellent" if score >= 85 else "Good" if score >= 70 else "Fair" if score >= 50 else "Poor"

    return {
        "health_score": score,
        "health_status": health_status,
        "insights": insights
    }
