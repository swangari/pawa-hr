from services.employee import EmployeeService
from schemas.employee import EmployeeCreate, EmployeeUpdate, Employee
from core.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/employee", tags=["Employees"])


@router.post(
    "/",
    response_model=Employee,
    summary="Create a new employee",
    status_code=status.HTTP_201_CREATED,
)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    try:
        return EmployeeService(db).create_employee(employee)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=List[Employee],
    summary="Get all employees",
    status_code=status.HTTP_200_OK,
)
def get_employees(db: Session = Depends(get_db)):
    try:
        return EmployeeService(db).get_employees()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{employee_id}",
    response_model=Employee,
    summary="Get a single employee",
    status_code=status.HTTP_200_OK,
)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = EmployeeService(db).get_employee(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put(
    "/{employee_id}",
    response_model=Employee,
    summary="Update an employee",
    status_code=status.HTTP_200_OK,
)
def update_employee(
    employee_id: str, employee: EmployeeUpdate, db: Session = Depends(get_db)
):
    try:
        updated_employee = EmployeeService(db).update_employee(employee_id, employee)
        if not updated_employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return updated_employee
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete(
    "/{employee_id}",
    summary="Delete an employee",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    try:
        deleted_employee = EmployeeService(db).delete_employee(employee_id)
        if not deleted_employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return deleted_employee
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
