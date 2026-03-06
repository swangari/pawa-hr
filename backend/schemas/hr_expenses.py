from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.hr_expenses import ExpenseType


class ExpenseBase(BaseModel):
    description: str
    amount: int
    expense_type: ExpenseType
    budget_id: str


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[int] = None
    expense_type: Optional[ExpenseType] = None
    budget_id: Optional[str] = None


class Expense(ExpenseBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
