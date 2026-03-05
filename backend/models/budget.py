from core.database import Base
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(255), nullable=False) # Store as "YYYY-MM" or similar
    amount = Column(Integer, nullable=False)
    
    expenses = relationship("Expense", back_populates="budget")

    def __repr__(self):
        return f"<Budget(id={self.id}, month={self.month}, amount={self.amount})>"
