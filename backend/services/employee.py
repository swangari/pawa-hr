import uuid as _uuid
from schemas.employee import EmployeeCreate, EmployeeUpdate
from models.employee import Employee as EmployeeModel
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException


class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def create_employee(self, employee: EmployeeCreate) -> EmployeeModel:
        # Validate that the department exists
        from models.departments import Department as DepartmentModel

        department = (
            self.db.query(DepartmentModel)
            .filter(DepartmentModel.uuid == employee.dept_uuid)
            .first()
        )
        if not department:
            raise HTTPException(
                status_code=404,
                detail=f"Department with uuid '{employee.dept_uuid}' does not exist",
            )

        try:
            employee_data = employee.dict()
            employee_data["uuid"] = str(_uuid.uuid4())
            db_employee = EmployeeModel(**employee_data)
            self.db.add(db_employee)
            self.db.commit()
            self.db.refresh(db_employee)
            return db_employee
        except Exception as e:
            self.db.rollback()
            raise e

    def get_employee(self, employee_uuid: str) -> Optional[EmployeeModel]:
        return (
            self.db.query(EmployeeModel)
            .filter(EmployeeModel.uuid == employee_uuid)
            .first()
        )

    def get_employees(self) -> List[EmployeeModel]:
        return self.db.query(EmployeeModel).all()

    def update_employee(
        self, employee_uuid: str, employee: EmployeeUpdate
    ) -> Optional[EmployeeModel]:
        try:
            db_employee = self.get_employee(employee_uuid)
            if not db_employee:
                return None
            for field, value in employee.dict(exclude_unset=True).items():
                setattr(db_employee, field, value)
            self.db.commit()
            self.db.refresh(db_employee)
            return db_employee
        except Exception as e:
            self.db.rollback()
            raise e

    def delete_employee(self, employee_uuid: str) -> Optional[EmployeeModel]:
        try:
            db_employee = self.get_employee(employee_uuid)
            if not db_employee:
                return None
            self.db.delete(db_employee)
            self.db.commit()
            return db_employee
        except Exception as e:
            self.db.rollback()
            raise e
