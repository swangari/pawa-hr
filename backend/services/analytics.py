from models import Department, Employee, Budget
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
import calendar


def get_month_range(month_str: str):
    """Get the first and last day of a month string 'YYYY-MM'."""
    dt = datetime.strptime(month_str, "%Y-%m")
    first_day = dt.replace(day=1)
    last_day = dt.replace(day=calendar.monthrange(dt.year, dt.month)[1])
    return first_day, last_day


def calculate_department_headcount(db: Session, month: str = None) -> Dict[str, Any]:
    """Calculate headcount for each department as of a specific month."""
    if not month:
        month = datetime.now().strftime("%Y-%m")
    _, last_day = get_month_range(month)

    headcount_data = {}
    departments = db.query(Department).all()

    for dept in departments:
        # Count employees who were hired on or before the end of the month
        # and are either still active or were terminated after the end of the month
        count = (
            db.query(Employee)
            .filter(Employee.dept_id == dept.id, Employee.hire_date <= last_day)
            .filter(
                (Employee.termination_date is None)
                | (Employee.termination_date > last_day)
            )
            .count()
        )
        headcount_data[dept.name] = count

    return headcount_data


def calculate_retention_rate(db: Session, month: str = None) -> Dict[str, Any]:
    """Calculate retention rate for each department as of a specific month."""
    if not month:
        month = datetime.now().strftime("%Y-%m")
    _, last_day = get_month_range(month)

    retention_data = {}
    departments = db.query(Department).all()

    for dept in departments:
        # Total employees ever in this department up to this month
        total_employees = (
            db.query(Employee)
            .filter(Employee.dept_id == dept.id, Employee.hire_date <= last_day)
            .all()
        )

        if not total_employees:
            retention_data[dept.name] = 0
            continue

        # Active employees as of the end of the month
        active_count = sum(
            1
            for emp in total_employees
            if emp.termination_date is None or emp.termination_date > last_day
        )

        retention_rate = (active_count / len(total_employees)) * 100
        retention_data[dept.name] = round(retention_rate, 1)

    return retention_data


def calculate_total_budget_percentage_used(db: Session, month: str = None) -> float:
    """Calculate the total percentage of budget used for the specified month."""
    if not month:
        month = datetime.now().strftime("%Y-%m")

    total_budget = db.query(Budget).filter_by(month=month).first()
    if not total_budget or total_budget.amount == 0:
        return 0.0

    # Strictly use the expenses linked to this budget
    total_expenses = sum(exp.amount for exp in total_budget.expenses)

    percentage = (total_expenses / total_budget.amount) * 100
    return round(percentage, 1)


def calculate_monthly_expenses_vs_budget(
    db: Session, end_month: str = None
) -> List[Dict[str, Any]]:
    """Compare monthly expenses against budget for 12 months ending at end_month."""
    if not end_month:
        end_month = datetime.now().strftime("%Y-%m")

    data = []
    # Get the last 12 budgets ending at end_month
    budgets = (
        db.query(Budget)
        .filter(Budget.month <= end_month)
        .order_by(Budget.month.desc())
        .limit(12)
        .all()
    )

    for budget in budgets:
        total_expenses = sum(exp.amount for exp in budget.expenses)
        data.append(
            {"month": budget.month, "budget": budget.amount, "expenses": total_expenses}
        )

    return sorted(data, key=lambda x: x["month"])


def calculate_expense_categories_over_time(
    db: Session, end_month: str = None
) -> List[Dict[str, Any]]:
    """Get expense categories breakdown over the last 12 months."""
    if not end_month:
        end_month = datetime.now().strftime("%Y-%m")

    # Get budgets for the last 12 months
    budgets = (
        db.query(Budget)
        .filter(Budget.month <= end_month)
        .order_by(Budget.month.desc())
        .limit(12)
        .all()
    )

    result = []
    for budget in budgets:
        month_name = datetime.strptime(budget.month, "%Y-%m").strftime("%b")
        month_data = {"month": month_name, "sort_key": budget.month}

        for exp in budget.expenses:
            cat = exp.expense_type.value
            month_data[cat] = month_data.get(cat, 0) + exp.amount

        result.append(month_data)

    # Sort chronologically
    result.sort(key=lambda x: x["sort_key"])
    for item in result:
        item.pop("sort_key")

    return result


def calculate_average_tenure(db: Session, month: str = None) -> float:
    """Calculate average tenure of active employees in years."""
    if not month:
        month = datetime.now().strftime("%Y-%m")
    _, last_day = get_month_range(month)

    active_employees = (
        db.query(Employee)
        .filter(Employee.hire_date <= last_day)
        .filter(
            (Employee.termination_date == None) | (Employee.termination_date > last_day)
        )
        .all()
    )

    if not active_employees:
        return 0.0

    total_tenure_days = 0
    for emp in active_employees:
        tenure = last_day - emp.hire_date
        total_tenure_days += tenure.days

    avg_tenure_years = (total_tenure_days / len(active_employees)) / 365.25
    return round(avg_tenure_years, 1)


def get_dashboard_analytics(db: Session, month: str = None) -> Dict[str, Any]:
    """Get all dashboard analytics for a specific month."""
    if not month:
        month = datetime.now().strftime("%Y-%m")

    # Ensure headcount and retention reflect the selected month
    analytics = {
        "department_headcount": calculate_department_headcount(db, month),
        "retention_rate": calculate_retention_rate(db, month),
        "budget_used_percentage": calculate_total_budget_percentage_used(db, month),
        "monthly_expenses_vs_budget": calculate_monthly_expenses_vs_budget(db, month),
        "expense_categories_over_time": calculate_expense_categories_over_time(
            db, month
        ),
        "total_employees": sum(calculate_department_headcount(db, month).values()),
        "average_tenure": calculate_average_tenure(db, month),
    }

    return analytics
