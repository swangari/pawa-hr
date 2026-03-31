from core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from enum import Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4


class ExpenseType(str, Enum):
    TRANSPORTATION = "TRANSPORTATION"
    ACCOMMODATION = "ACCOMMODATION"
    SALARY = "SALARY"
    AIRTIME = "AIRTIME"
    RECRUITMENT = "RECRUITMENT"
    EMPLOYEE = "EMPLOYEE"
    TRAINING = "TRAINING"
    SYSTEM = "SYSTEM"
    WELFARE = "WELFARE"
    ENGAGEMENT = "ENGAGEMENT"
    LEGAL = "LEGAL"


class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid4()))
    description = Column(String(255), nullable=False)
    amount = Column(Integer, nullable=False)
    expense_type = Column(String(100), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    budget_id = Column(String(36), ForeignKey("budgets.id"), nullable=False)

    budget = relationship("Budget", back_populates="expenses")

    def __repr__(self):
        return f"<Expense(id={self.id}, description={self.description}, amount={self.amount}, expense_type={self.expense_type})>"
