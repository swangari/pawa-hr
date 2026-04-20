from models import Department, Employee, Budget, Expense
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
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


def calculate_payroll_for_months(db: Session, months: List[str], only_actual: bool = False) -> float:
    """Calculate precise payroll for a list of months by checking employee active status in each month.
    If only_actual is True, it will not count payroll for months in the future relative to today.
    """
    total_payroll = 0.0
    now = datetime.now()
    current_month_str = now.strftime("%Y-%m")
    
    for m in months:
        # If we only want actual spend (YTD), skip future months
        if only_actual and m > current_month_str:
            continue
            
        year, month_num = int(m[:4]), int(m[5:7])
        first_day = datetime(year, month_num, 1)
        last_day = datetime(year, month_num, calendar.monthrange(year, month_num)[1], 23, 59, 59)
        
        # Employee was active if hired on/before last day AND (not terminated OR terminated after first day)
        active_employees = db.query(Employee).filter(
            Employee.hire_date <= last_day,
            (Employee.termination_date.is_(None)) | (Employee.termination_date >= first_day)
        ).all()
        
        total_payroll += sum(float((emp.salary or 0) + (emp.airtime_allowance or 0)) for emp in active_employees)
    return total_payroll


def calculate_total_budget_percentage_used(db: Session, period: str = None) -> float:
    """Calculate the total percentage of budget used for the specified period against ANNUAL budget."""
    first_day, last_day, months = parse_period(period)
    year = first_day.year

    annual_budget = db.query(Budget).filter(Budget.month == str(year)).first()
    if not annual_budget or annual_budget.amount == 0:
        return 0.0

    total_expenses = float(db.query(func.sum(Expense.amount)).filter(
        Expense.date >= first_day,
        Expense.date <= last_day
    ).scalar() or 0)

    # For dashboard high-level percentage, use the precise multi-month YTD calculation
    # We use only_actual=True to show what has been spent so far in the year
    total_payroll = calculate_payroll_for_months(db, months, only_actual=True)

    total_spend = total_expenses + total_payroll
    percentage = (total_spend / float(annual_budget.amount)) * 100
    return round(percentage, 1)


def calculate_monthly_expenses_vs_budget(
    db: Session, period: str = None
) -> List[Dict[str, Any]]:
    """Compare periodic expenses against the full annual budget for the specified period."""
    first_day, last_day, months = parse_period(period)
    year = first_day.year

    annual_budget = db.query(Budget).filter(Budget.month == str(year)).first()
    budget_amount = annual_budget.amount if annual_budget else 0

    data = []
    
    # If period is more than a month, we group by month
    if len(months) > 1:
        for m in months:
            m_year, m_month = int(m[:4]), int(m[5:7])
            m_first_day = datetime(m_year, m_month, 1)
            m_last_day = datetime(m_year, m_month, calendar.monthrange(m_year, m_month)[1], 23, 59, 59)
            
            m_expenses = float(db.query(func.sum(Expense.amount)).filter(
                Expense.date >= m_first_day,
                Expense.date <= m_last_day
            ).scalar() or 0)
            
            m_payroll = calculate_payroll_for_months(db, [m])
            
            # Scale budget to monthly portion for chart readability
            m_budget = float(budget_amount) / 12
            
            m_total = m_expenses + m_payroll
            data.append({"month": m, "budget": m_budget, "expenses": m_total})
    else:
        # Single month - show against full annual budget portion (or full annual if preferred)
        # But for consistency with multi-view, we scale here too
        total_expenses = float(db.query(func.sum(Expense.amount)).filter(
            Expense.date >= first_day,
            Expense.date <= last_day
        ).scalar() or 0)
        
        total_payroll = calculate_payroll_for_months(db, months)
        
        data.append({"month": months[0], "budget": float(budget_amount) / 12, "expenses": total_expenses + total_payroll})

    return data


def calculate_expense_categories_over_time(
    db: Session, period: str = None
) -> List[Dict[str, Any]]:
    """Get expense categories breakdown over the specified period."""
    _, _, months = parse_period(period)

    result = []
    for m in months:
        m_year, m_month = int(m[:4]), int(m[5:7])
        m_first_day = datetime(m_year, m_month, 1)
        m_last_day = datetime(m_year, m_month, calendar.monthrange(m_year, m_month)[1], 23, 59, 59)
        
        month_name = datetime.strptime(m, "%Y-%m").strftime("%b")
        month_data = {"month": month_name, "sort_key": m}

        # Categories from Expenses table
        cat_expenses = db.query(Expense.expense_type, func.sum(Expense.amount)).filter(
            Expense.date >= m_first_day,
            Expense.date <= m_last_day
        ).group_by(Expense.expense_type).all()
        
        for cat, amt in cat_expenses:
            month_data[cat] = float(amt)

        # Add Salary category
        m_payroll = calculate_payroll_for_months(db, [m])
        if m_payroll > 0:
            month_data["SALARY"] = m_payroll

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
