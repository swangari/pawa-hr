from sqlalchemy.orm import Session
from models.hr_expenses import Expense as ExpenseModel
from models.budget import Budget
from schemas.hr_expenses import ExpenseCreate, ExpenseUpdate
from typing import Optional, List


class ExpenseService:
    def __init__(self, db: Session):
        self.db = db

    def create_expense(self, expense: ExpenseCreate) -> ExpenseModel:
        try:
            from datetime import datetime
            if expense.date.date() > datetime.now().date():
                raise ValueError("Expense date cannot be in the future.")

            # Validate budget exists and matches expense year
            budget = self.db.query(Budget).filter(Budget.id == expense.budget_id).first()
            if not budget:
                # Attempt to find budget by year if ID might be stale or incorrect
                expense_year = expense.date.strftime("%Y")
                budget = self.db.query(Budget).filter(Budget.month == expense_year).first()
                if not budget:
                    raise ValueError(f"No annual budget found for the year {expense_year}. Please create a budget for this year first.")
                expense.budget_id = budget.id

            expense_data = expense.dict()
            expense_data['expense_type'] = expense_data['expense_type'].upper()
            db_expense = ExpenseModel(**expense_data)
            self.db.add(db_expense)
            self.db.commit()
            self.db.refresh(db_expense)
            return db_expense
        except Exception as e:
            self.db.rollback()
            raise e

    def get_expense(self, expense_id: str) -> Optional[ExpenseModel]:
        return self.db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()

    def get_expenses(self) -> List[ExpenseModel]:
        return self.db.query(ExpenseModel).all()

    def update_expense(
        self, expense_id: str, expense: ExpenseUpdate
    ) -> Optional[ExpenseModel]:
        try:
            from datetime import datetime
            if expense.date and expense.date.date() > datetime.now().date():
                raise ValueError("Expense date cannot be in the future.")
            
            db_expense = self.get_expense(expense_id)
            if not db_expense:
                return None
            
            for field, value in expense.dict(exclude_unset=True).items():
                setattr(db_expense, field, value)
            self.db.commit()
            self.db.refresh(db_expense)
            return db_expense
        except Exception as e:
            self.db.rollback()
            raise e

    def delete_expense(self, expense_id: str) -> Optional[ExpenseModel]:
        try:
            db_expense = self.get_expense(expense_id)
            if not db_expense:
                return None
            
            self.db.delete(db_expense)
            self.db.commit()
            return db_expense
        except Exception as e:
            self.db.rollback()
            raise e
