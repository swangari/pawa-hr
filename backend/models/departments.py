from core.database import Base
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class Department(Base):
    __tablename__ = "departments"
    uuid = Column(String(36), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employees = relationship("Employee", back_populates="department")

    def __repr__(self):
        return f"<Department(uuid={self.uuid}, name={self.name}, description={self.description})>"
