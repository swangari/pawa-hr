from pydantic import BaseModel
from typing import Optional

class BudgetBase(BaseModel):
    month: str
    amount: int

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    month: Optional[str] = None
    amount: Optional[int] = None

class Budget(BudgetBase):
    id: int

    class Config:
        from_attributes = True
