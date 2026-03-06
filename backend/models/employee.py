from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Enum as SQLEnum
from enum import Enum
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime
from uuid import uuid4


class ContractType(str, Enum):
    PERMANENT = "permanent"
    CONTRACT = "contract"
    GRADUATE_TRAINEE = "graduate_trainee"
    INTERN = "intern"


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid4()))
    name = Column(String(255), index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(255), nullable=False)
    dept_id = Column(String(36), ForeignKey("departments.id"), nullable=False)
    contract_type = Column(SQLEnum(ContractType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    department = relationship("Department", back_populates="employees")

    @property
    def department_name(self):
        return self.department.name if self.department else None

    def __repr__(self):
        return f"<Employee(id={self.id}, name={self.name}, email={self.email}, role={self.role}, is_active={self.is_active}, contract_type={self.contract_type}, dept_id={self.dept_id})>"
