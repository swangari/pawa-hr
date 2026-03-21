from models import Employee, Department, Expense, Budget
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy import func, extract
from sqlalchemy.orm import Session


def calculate_department_headcount(db: Session) -> Dict[str, Any]:
    """Calculate headcount for each department."""
    headcount_data = {}
    departments = db.query(Department).all()

    for dept in departments:
        count = db.query(Employee).filter_by(dept_id=dept.id, is_active=True).count()
        headcount_data[dept.name] = count

    return headcount_data


def calculate_retention_rate(db: Session) -> Dict[str, Any]:
    """Calculate retention rate for each department."""
    retention_data = {}
    departments = db.query(Department).all()

    for dept in departments:
        employees = db.query(Employee).filter_by(dept_id=dept.id).all()
        if not employees:
            retention_data[dept.name] = 0
            continue

        active_count = sum(1 for emp in employees if emp.is_active)
        retention_rate = (active_count / len(employees)) * 100
        retention_data[dept.name] = round(retention_rate, 1)

    return retention_data


def calculate_total_budget_percentage_used(db: Session, month: str = None) -> float:
    """Calculate the total percentage of budget used for the specified month."""
    if not month:
        month = datetime.now().strftime("%Y-%m")
    
    total_budget = db.query(Budget).filter_by(month=month).first()
    if not total_budget or total_budget.amount == 0:
        return 0.0
    
    total_expenses = db.query(Expense).filter(
        Expense.budget_id == total_budget.id
    ).with_entities(func.sum(Expense.amount)).scalar() or 0
    
    percentage = (total_expenses / total_budget.amount) * 100
    return round(percentage, 1)


def calculate_monthly_expenses_vs_budget(db: Session, end_month: str = None) -> List[Dict[str, Any]]:
    """Compare monthly expenses against budget for 6 months ending at end_month."""
    data = []
    query = db.query(Budget).order_by(Budget.month.desc())
    if end_month:
        query = query.filter(Budget.month <= end_month)
    
    budgets = query.limit(6).all()
    
    for budget in budgets:
        total_expenses = sum(exp.amount for exp in budget.expenses)
        data.append({
            "month": budget.month,
            "budget": budget.amount,
            "expenses": total_expenses
        })
    
    return sorted(data, key=lambda x: x["month"])


def calculate_expense_categories_over_time(db: Session) -> List[Dict[str, Any]]:
    """Get expense categories breakdown over the last 6 months."""
    # This is a bit more complex, let's group by month and category
    current_year = datetime.now().year
    
    # Get expenses for the last 6 months
    expenses = db.query(Expense).filter(
        extract('year', Expense.date) == current_year
    ).all()
    
    # Grouping logic
    result = {}
    for exp in expenses:
        month = exp.date.strftime("%b")
        if month not in result:
            result[month] = {"month": month}
        
        category = exp.expense_type.value
        result[month][category] = result[month].get(category, 0) + exp.amount
        
    return list(result.values())


def get_dashboard_analytics(db: Session, month: str = None) -> Dict[str, Any]:
    """Get all dashboard analytics for a specific month."""
    analytics = {
        "department_headcount": calculate_department_headcount(db),
        "retention_rate": calculate_retention_rate(db),
        "budget_used_percentage": calculate_total_budget_percentage_used(db, month),
        "monthly_expenses_vs_budget": calculate_monthly_expenses_vs_budget(db, month),
        "expense_categories_over_time": calculate_expense_categories_over_time(db),
        "total_employees": db.query(Employee).filter_by(is_active=True).count(),
        "average_tenure": 1.5,
    }

    return analytics
