"""change_expense_type_to_string

Revision ID: 655d589d5a95
Revises: 7cbdf6114499
Create Date: 2026-03-31 11:29:50.162815

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '655d589d5a95'
down_revision: Union[str, Sequence[str], None] = '7cbdf6114499'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('expenses', 'expense_type',
               existing_type=sa.Enum('TRANSPORTATION', 'ACCOMMODATION', 'SALARY', 'AIRTIME', 'RECRUITMENT', 'EMPLOYEE', 'TRAINING', 'SYSTEM', 'WELFARE', 'ENGAGEMENT', 'LEGAL', name='expensetype'),
               type_=sa.String(length=100),
               existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('expenses', 'expense_type',
               existing_type=sa.String(length=100),
               type_=sa.Enum('TRANSPORTATION', 'ACCOMMODATION', 'SALARY', 'AIRTIME', 'RECRUITMENT', 'EMPLOYEE', 'TRAINING', 'SYSTEM', 'WELFARE', 'ENGAGEMENT', 'LEGAL', name='expensetype'),
               existing_nullable=False)

