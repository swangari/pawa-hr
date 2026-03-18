from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from models.employee import ContractType


class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    dept_id: str
    contract_type: ContractType
    is_active: bool = True
    salary: Optional[float] = 0.0
    airtime_allowance: Optional[float] = 0.0
    hire_date: Optional[datetime] = None
    termination_date: Optional[datetime] = None


class EmployeeCreate(EmployeeBase):
    id: Optional[str] = None


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    dept_id: Optional[str] = None
    contract_type: Optional[ContractType] = None
    is_active: Optional[bool] = None
    salary: Optional[float] = None
    airtime_allowance: Optional[float] = None
    hire_date: Optional[datetime] = None
    termination_date: Optional[datetime] = None


class EmployeeDelete(BaseModel):
    id: str


# Slim nested model used by DepartmentSchema to list employees without circular import
class EmployeeNested(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    contract_type: ContractType
    is_active: bool


class Employee(EmployeeBase):
    id: str
    department_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
