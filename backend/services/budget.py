from schemas.budget import BudgetCreate, BudgetUpdate
from models.budget import Budget
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List, Optional


class BudgetService:
    def __init__(self, db: Session):
        self.db = db

    def create_budget(self, budget: BudgetCreate) -> Budget:
        db_budget = Budget(**budget.dict())
        self.db.add(db_budget)
        self.db.commit()
        self.db.refresh(db_budget)
        return db_budget

    def get_budgets(self) -> List[Budget]:
        return self.db.execute(select(Budget)).scalars().all()

    def get_budget(self, budget_id: int) -> Optional[Budget]:
        return self.db.execute(
            select(Budget).where(Budget.id == budget_id)
        ).scalar_one_or_none()

    def update_budget(self, budget_id: int, budget: BudgetUpdate) -> Optional[Budget]:
        db_budget = self.get_budget(budget_id)
        if not db_budget:
            return None
        for field, value in budget.dict().items():
            setattr(db_budget, field, value)
        self.db.commit()
        self.db.refresh(db_budget)
        return db_budget

    def delete_budget(self, budget_id: int) -> Optional[Budget]:
        db_budget = self.get_budget(budget_id)
        if not db_budget:
            return None
        self.db.delete(db_budget)
        self.db.commit()
        return db_budget
