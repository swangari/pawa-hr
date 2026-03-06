from models.departments import Department as DepartmentModel
from schemas.department import DepartmentCreate, DepartmentUpdate
from sqlalchemy.orm import Session
from typing import List, Optional


class DepartmentService:
    def __init__(self, db: Session):
        self.db = db

    def create_department(self, department: DepartmentCreate) -> DepartmentModel:
        try:
            dept_data = department.dict()
            db_department = DepartmentModel(**dept_data)
            self.db.add(db_department)
            self.db.commit()
            self.db.refresh(db_department)
            return db_department
        except Exception as e:
            self.db.rollback()
            raise e

    def get_department(self, department_id: str) -> Optional[DepartmentModel]:
        return (
            self.db.query(DepartmentModel)
            .filter(DepartmentModel.id == department_id)
            .first()
        )

    def get_departments(self) -> List[DepartmentModel]:
        return self.db.query(DepartmentModel).all()

    def update_department(
        self, department_id: str, department: DepartmentUpdate
    ) -> Optional[DepartmentModel]:
        try:
            db_department = self.get_department(department_id)
            if not db_department:
                return None
            for field, value in department.dict(exclude_unset=True).items():
                setattr(db_department, field, value)
            self.db.commit()
            self.db.refresh(db_department)
            return db_department
        except Exception as e:
            self.db.rollback()
            raise e

    def delete_department(self, department_id: str) -> Optional[DepartmentModel]:
        try:
            db_department = self.get_department(department_id)
            if not db_department:
                return None
            self.db.delete(db_department)
            self.db.commit()
            return db_department
        except Exception as e:
            self.db.rollback()
            raise e
