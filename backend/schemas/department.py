from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from schemas.employee import EmployeeNested


class DepartmentBase(BaseModel):
    name: str
    description: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Department(DepartmentBase):
    uuid: str
    created_at: datetime
    updated_at: datetime
    employees: List["EmployeeNested"] = []

    class Config:
        from_attributes = True


Department.model_rebuild()
