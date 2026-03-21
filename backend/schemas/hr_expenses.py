from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ExpenseBase(BaseModel):
    description: str
    amount: int
    expense_type: str
    budget_id: str
    date: datetime


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[int] = None
    expense_type: Optional[str] = None
    budget_id: Optional[str] = None
    date: Optional[datetime] = None


class Expense(ExpenseBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
