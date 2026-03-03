from pydantic import BaseModel
from datetime import datetime

class EmployeeBase(BaseModel):
    name: str
    email: str
    phone: str
    role: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeDelete(BaseModel):
    id: int
    
class Employee(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True