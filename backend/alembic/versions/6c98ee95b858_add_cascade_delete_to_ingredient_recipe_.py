"""add cascade delete to ingredient recipe fk

Revision ID: 6c98ee95b858
Revises: 
Create Date: 2026-01-21 16:15:38.898123

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c98ee95b858'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint(
        "ingredients_recipe_id_fkey",
        "ingredients",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "ingredients_recipe_id_fkey",
        "ingredients",
        "recipes",
        ["recipe_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        "ingredients_recipe_id_fkey",
        "ingredients",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "ingredients_recipe_id_fkey",
        "ingredients",
        "recipes",
        ["recipe_id"],
        ["id"],
    )
