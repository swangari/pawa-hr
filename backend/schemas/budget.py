from pydantic import BaseModel
from typing import Optional, List
from schemas.hr_expenses import Expense as ExpenseSchema


class BudgetBase(BaseModel):
    month: str
    amount: int


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    month: Optional[str] = None
    amount: Optional[int] = None


class Budget(BudgetBase):
    id: str
    expenses: List[ExpenseSchema] = []

    class Config:
        from_attributes = True


class BudgetDelete(BaseModel):
    id: str
