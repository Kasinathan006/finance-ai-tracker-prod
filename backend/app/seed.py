import uuid
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.transaction import Category

def seed_categories():
    db = SessionLocal()
    
    default_categories = [
        {"name": "Food & Dining", "icon": "Utensils", "color": "#EF4444"},
        {"name": "Transportation", "icon": "Car", "color": "#3B82F6"},
        {"name": "Shopping", "icon": "ShoppingBag", "color": "#8B5CF6"},
        {"name": "Entertainment", "icon": "Film", "color": "#F59E0B"},
        {"name": "Health", "icon": "Heart", "color": "#10B981"},
        {"name": "Utilities", "icon": "Zap", "color": "#6366F1"},
        {"name": "Housing", "icon": "Home", "color": "#EC4899"},
        {"name": "Salary", "icon": "DollarSign", "color": "#059669"},
        {"name": "Investments", "icon": "TrendingUp", "color": "#06B6D4"}
    ]

    for cat in default_categories:
        exists = db.query(Category).filter(Category.name == cat["name"]).first()
        if not exists:
            db_cat = Category(**cat, id=uuid.uuid4())
            db.add(db_cat)
    
    db.commit()
    db.close()
    print("Seed data created successfully")

if __name__ == "__main__":
    seed_categories()
