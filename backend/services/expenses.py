from sqlalchemy.orm import Session
from models.hr_expenses import Expense as ExpenseModel
from schemas.hr_expenses import ExpenseCreate, ExpenseUpdate
from typing import Optional, List


class ExpenseService:
    def __init__(self, db: Session):
        self.db = db

    def create_expense(self, expense: ExpenseCreate) -> ExpenseModel:
        try:
            expense_data = expense.dict()
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
