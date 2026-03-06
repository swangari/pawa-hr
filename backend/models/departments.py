from core.database import Base
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4


class Department(Base):
    __tablename__ = "departments"
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employees = relationship("Employee", back_populates="department")

    def __repr__(self):
        return f"<Department(id={self.id}, name={self.name}, description={self.description})>"
