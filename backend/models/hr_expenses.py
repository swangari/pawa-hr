from core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from enum import Enum
from sqlalchemy.orm import relationship
from datetime import datetime

class ExpenseType(str, Enum):
    TRANSPORTATION = "transportation"
    ACCOMMODATION = "accommodation"
    SALARY = "salary"
    AIRTIME = "airtime"
    RECRUITMENT = "recruitment"
    TRAINING = "training"
    SYSTEM = "system"

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=False)
    amount = Column(Integer, nullable=False)
    expense_type = Column(SQLEnum(ExpenseType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)

    budget = relationship("Budget", back_populates="expenses")

    def __repr__(self):
        return f"<Expense(id={self.id}, description={self.description}, amount={self.amount}, expense_type={self.expense_type})>"