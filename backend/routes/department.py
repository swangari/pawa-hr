from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.department import DepartmentCreate, DepartmentUpdate, Department
from services.department import DepartmentService

router = APIRouter(prefix="/department", tags=["Departments"])


@router.post("/", response_model=Department, status_code=status.HTTP_201_CREATED)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    return DepartmentService(db).create_department(department)


@router.get("/", response_model=List[Department], status_code=status.HTTP_200_OK)
def get_departments(db: Session = Depends(get_db)):
    return DepartmentService(db).get_departments()


@router.get(
    "/{department_id}", response_model=Department, status_code=status.HTTP_200_OK
)
def get_department(department_id: int, db: Session = Depends(get_db)):
    db_department = DepartmentService(db).get_department(department_id)
    if not db_department:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department


@router.put(
    "/{department_id}", response_model=Department, status_code=status.HTTP_200_OK
)
def update_department(
    department_id: int, department: DepartmentUpdate, db: Session = Depends(get_db)
):
    updated_department = DepartmentService(db).update_department(
        department_id, department
    )
    if not updated_department:
        raise HTTPException(status_code=404, detail="Department not found")
    return updated_department


@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    deleted_department = DepartmentService(db).delete_department(department_id)
    if not deleted_department:
        raise HTTPException(status_code=404, detail="Department not found")
    return deleted_department
