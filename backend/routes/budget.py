from services.budget import BudgetService
from schemas.budget import BudgetCreate, BudgetUpdate, Budget as BudgetSchema
from core.database import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

router = APIRouter(prefix="/budget", tags=["Budget"])


@router.post(
    "/",
    response_model=BudgetSchema,
    summary="Create a budget",
    status_code=status.HTTP_201_CREATED,
)
def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)):
    try:
        return BudgetService(db).create_budget(budget)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=List[BudgetSchema],
    summary="Get all budgets",
    status_code=status.HTTP_200_OK,
)
def get_budgets(db: Session = Depends(get_db)):
    try:
        return BudgetService(db).get_budgets()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{budget_id}",
    response_model=BudgetSchema,
    summary="Get a budget",
    status_code=status.HTTP_200_OK,
)
def get_budget(budget_id: str, db: Session = Depends(get_db)):
    try:
        return BudgetService(db).get_budget(budget_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{budget_id}",
    response_model=BudgetSchema,
    summary="Update a budget",
    status_code=status.HTTP_200_OK,
)
def update_budget(
    budget_id: str,
    budget: BudgetUpdate,
    db: Session = Depends(get_db),
):
    try:
        return BudgetService(db).update_budget(budget_id, budget)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{budget_id}",
    summary="Delete a budget",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_budget(budget_id: str, db: Session = Depends(get_db)):
    try:
        deleted_budget = BudgetService(db).delete_budget(budget_id)
        if not deleted_budget:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget not found",
            )
        return deleted_budget
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
