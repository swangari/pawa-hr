from models import Department, Employee, Budget
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
import calendar


def parse_period(period_str: str):
    """Parse a period string (YYYY-MM, YYYY-QX, YYYY) into start date, end date, and list of months."""
    if not period_str:
        period_str = datetime.now().strftime("%Y-%m")

    year = int(period_str[:4])

    if len(period_str) == 7 and period_str[5] == "Q":
        q = int(period_str[6])
        start_month = (q - 1) * 3 + 1
        end_month = q * 3
        first_day = datetime(year, start_month, 1)
        last_day = datetime(
            year, end_month, calendar.monthrange(year, end_month)[1], 23, 59, 59
        )
        months = [f"{year}-{m:02d}" for m in range(start_month, end_month + 1)]
    elif len(period_str) == 4 or (len(period_str) == 6 and period_str.endswith("-Y")):
        first_day = datetime(year, 1, 1)
        last_day = datetime(year, 12, 31, 23, 59, 59)
        months = [f"{year}-{m:02d}" for m in range(1, 13)]
    else:
        month = int(period_str[5:7])
        first_day = datetime(year, month, 1)
        last_day = datetime(
            year, month, calendar.monthrange(year, month)[1], 23, 59, 59
        )
        months = [period_str]

    return first_day, last_day, months


def calculate_department_headcount(db: Session, period: str = None) -> Dict[str, Any]:
    """Calculate headcount for each department as of a specific period."""
    _, last_day, _ = parse_period(period)

    headcount_data = {}
    departments = db.query(Department).all()

    for dept in departments:
        # Count employees who were hired on or before the end of the month
        # and are either still active or were terminated after the end of the month
        count = (
            db.query(Employee)
            .filter(Employee.dept_id == dept.id, Employee.hire_date <= last_day)
            .filter(
                (Employee.termination_date.is_(None))
                | (Employee.termination_date > last_day)
            )
            .count()
        )
        headcount_data[dept.name] = count

    return headcount_data


def calculate_retention_rate(db: Session, period: str = None) -> Dict[str, Any]:
    """Calculate retention rate for each department as of a specific period."""
    _, last_day, _ = parse_period(period)

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

        active_count = sum(
            1
            for emp in total_employees
            if emp.termination_date is None or emp.termination_date > last_day
        )

        retention_rate = (active_count / len(total_employees)) * 100
        retention_data[dept.name] = round(retention_rate, 1)

    return retention_data


def calculate_global_retention_rate(db: Session, period: str = None) -> float:
    """Calculate the overall retention rate across the entire company for the period."""
    _, last_day, _ = parse_period(period)

    total_employees = db.query(Employee).filter(Employee.hire_date <= last_day).all()

    if not total_employees:
        return 0.0

    active_count = sum(
        1
        for emp in total_employees
        if emp.termination_date is None or emp.termination_date > last_day
    )

    return round((active_count / len(total_employees)) * 100, 1)


def calculate_total_budget_percentage_used(db: Session, period: str = None) -> float:
    """Calculate the total percentage of budget used for the specified period."""
    _, _, months = parse_period(period)

    budgets = db.query(Budget).filter(Budget.month.in_(months)).all()
    if not budgets:
        return 0.0

    total_budget_amount = sum(b.amount for b in budgets)
    if total_budget_amount == 0:
        return 0.0

    # Strictly use the expenses linked to these budgets
    total_expenses = sum(exp.amount for b in budgets for exp in b.expenses)

    percentage = (total_expenses / total_budget_amount) * 100
    return round(percentage, 1)


def calculate_monthly_expenses_vs_budget(
    db: Session, period: str = None
) -> List[Dict[str, Any]]:
    """Compare monthly expenses against budget for the specified period."""
    _, _, months = parse_period(period)

    data = []
    budgets = (
        db.query(Budget).filter(Budget.month.in_(months)).order_by(Budget.month).all()
    )
    budget_map = {b.month: b for b in budgets}

    for m in months:
        b = budget_map.get(m)
        if b:
            total_expenses = sum(exp.amount for exp in b.expenses)
            data.append({"month": m, "budget": b.amount, "expenses": total_expenses})
        else:
            data.append({"month": m, "budget": 0, "expenses": 0})

    return data


def calculate_expense_categories_over_time(
    db: Session, period: str = None
) -> List[Dict[str, Any]]:
    """Get expense categories breakdown over the specified period."""
    _, _, months = parse_period(period)

    budgets = (
        db.query(Budget).filter(Budget.month.in_(months)).order_by(Budget.month).all()
    )
    budget_map = {b.month: b for b in budgets}

    result = []
    for m in months:
        month_name = datetime.strptime(m, "%Y-%m").strftime("%b")
        month_data = {"month": month_name, "sort_key": m}

        b = budget_map.get(m)
        if b:
            for exp in b.expenses:
                cat = exp.expense_type
                month_data[cat] = month_data.get(cat, 0) + exp.amount

        result.append(month_data)

    for item in result:
        item.pop("sort_key")

    return result


def calculate_monthly_headcount_trend(
    db: Session, period: str = None
) -> List[Dict[str, Any]]:
    """Calculate total active headcount for each month in the period."""
    _, _, months = parse_period(period)
    result = []
    for m in months:
        year, month_num = int(m[:4]), int(m[5:7])
        last_day_of_month = datetime(
            year, month_num, calendar.monthrange(year, month_num)[1], 23, 59, 59
        )
        total = (
            db.query(Employee)
            .filter(Employee.hire_date <= last_day_of_month)
            .filter(
                (Employee.termination_date.is_(None))
                | (Employee.termination_date > last_day_of_month)
            )
            .count()
        )
        month_label = datetime.strptime(m, "%Y-%m").strftime("%b")
        result.append({"month": month_label, "total": total})
    return result


def calculate_average_tenure(db: Session, period: str = None) -> float:
    """Calculate average tenure of active employees in years."""
    _, last_day, _ = parse_period(period)

    active_employees = (
        db.query(Employee)
        .filter(Employee.hire_date <= last_day)
        .filter(
            (Employee.termination_date.is_(None))
            | (Employee.termination_date > last_day)
        )
        .all()
    )

    if not active_employees:
        return 0.0

    total_tenure_days = 0
    now = datetime.now()
    # If the period ends in the future, we cap tenure calculation to today
    end_date = min(last_day, now)

    for emp in active_employees:
        # Prevent negative tenure if hired in the future relative to now but before last_day
        if end_date > emp.hire_date:
            tenure = end_date - emp.hire_date
            total_tenure_days += tenure.days

    avg_tenure_years = (total_tenure_days / len(active_employees)) / 365.25
    return round(avg_tenure_years, 1)


def get_dashboard_analytics(db: Session, period: str = None) -> Dict[str, Any]:
    """Get all dashboard analytics for a specific period."""
    analytics = {
        "department_headcount": calculate_department_headcount(db, period),
        "retention_rate": calculate_retention_rate(db, period),
        "global_retention_rate": calculate_global_retention_rate(db, period),
        "budget_used_percentage": calculate_total_budget_percentage_used(db, period),
        "monthly_expenses_vs_budget": calculate_monthly_expenses_vs_budget(db, period),
        "expense_categories_over_time": calculate_expense_categories_over_time(db, period),
        "monthly_headcount_trend": calculate_monthly_headcount_trend(db, period),
        "total_employees": sum(calculate_department_headcount(db, period).values()),
        "average_tenure": calculate_average_tenure(db, period),
    }
    return analytics
