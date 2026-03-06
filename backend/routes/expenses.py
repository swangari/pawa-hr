from services.expenses import ExpenseService
from schemas.hr_expenses import ExpenseCreate, ExpenseUpdate
from core.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post(
    "/",
    response_model=ExpenseCreate,
    summary="Create an expense",
    status_code=status.HTTP_201_CREATED,
)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    try:
        return ExpenseService(db).create_expense(expense)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=List[ExpenseCreate],
    summary="Get all expenses",
    status_code=status.HTTP_200_OK,
)
def get_expenses(db: Session = Depends(get_db)):
    try:
        return ExpenseService(db).get_expenses()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{expense_uuid}",
    response_model=ExpenseCreate,
    summary="Get an expense",
    status_code=status.HTTP_200_OK,
)
def get_expense(expense_uuid: str, db: Session = Depends(get_db)):
    try:
        expense = ExpenseService(db).get_expense(expense_uuid)
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        return expense
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{expense_uuid}",
    response_model=ExpenseCreate,
    summary="Update an expense",
    status_code=status.HTTP_200_OK,
)
def update_expense(
    expense_uuid: str, expense: ExpenseUpdate, db: Session = Depends(get_db)
):
    try:
        updated_expense = ExpenseService(db).update_expense(expense_uuid, expense)
        if not updated_expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        return updated_expense
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{expense_uuid}",
    summary="Delete an expense",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_expense(expense_uuid: str, db: Session = Depends(get_db)):
    try:
        deleted_expense = ExpenseService(db).delete_expense(expense_uuid)
        if not deleted_expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        return deleted_expense
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
