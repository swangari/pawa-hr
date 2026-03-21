from services.analytics import get_dashboard_analytics
from fastapi import APIRouter, Depends
from core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(tags=["Analytics"], prefix="/analytics")


@router.get("/dashboard")
def get_dashboard(month: str = None, db: Session = Depends(get_db)):
    """Get dashboard analytics."""
    analytics = get_dashboard_analytics(db, month)
    return analytics
