from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func

from app.db.base import Base


class Import(Base):
    __tablename__ = "imports"

    id = Column(String, primary_key=True)
    status = Column(String, nullable=False)
    provider = Column(String)

    source_type = Column(String, nullable=False)   # url | file
    source_url = Column(Text)

    recipe_id = Column(
        Integer, 
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=True,
    )
    progress = Column(Integer, default=0)
    error = Column(Text)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(),
                        onupdate=func.now())
