from datetime import datetime
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
            # Check for past month
            current_month = datetime.now().strftime("%Y-%m")
            expense_month = expense.date.strftime("%Y-%m")
            if expense_month < current_month:
                raise ValueError("Cannot add expenses to a past month.")

            # Validate budget month matches expense date
            budget = self.db.query(Budget).filter(Budget.id == expense.budget_id).first()
            if not budget:
                raise ValueError("Budget not found")
            
            # Format: budget.month is "YYYY-MM", expense.date is datetime
            expense_month = expense.date.strftime("%Y-%m")
            if expense_month != budget.month:
                raise ValueError(f"Expense date {expense_month} does not match budget month {budget.month}")

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
            db_expense = self.get_expense(expense_id)
            if not db_expense:
                return None
            
            # Check for past month
            current_month = datetime.now().strftime("%Y-%m")
            expense_month = db_expense.date.strftime("%Y-%m")
            if expense_month < current_month:
                raise ValueError("Past month expenses are immutable and cannot be updated.")

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
            
            # Check for past month
            current_month = datetime.now().strftime("%Y-%m")
            expense_month = db_expense.date.strftime("%Y-%m")
            if expense_month < current_month:
                raise ValueError("Past month expenses are immutable and cannot be deleted.")

            self.db.delete(db_expense)
            self.db.commit()
            return db_expense
        except Exception as e:
            self.db.rollback()
            raise e
