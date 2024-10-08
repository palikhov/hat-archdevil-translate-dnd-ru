from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Index, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.glossary.models import GlossaryDocument


xliff_to_tmx_link = Table(
    "xliff_record_to_tmx",
    Base.metadata,
    Column("xliff_id", ForeignKey("xliff_document.id"), nullable=False),
    Column("tmx_id", ForeignKey("tmx_document.id"), nullable=False),
)


class TmxDocument(Base):
    __tablename__ = "tmx_document"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"))

    records: Mapped[list["TmxRecord"]] = relationship(
        back_populates="document", cascade="all, delete-orphan", order_by="TmxRecord.id"
    )
    user: Mapped["User"] = relationship(back_populates="tmxs")
    xliffs: Mapped[list["XliffDocument"]] = relationship(
        secondary=xliff_to_tmx_link, back_populates="tmxs", order_by="XliffDocument.id"
    )


class TmxRecord(Base):
    __tablename__ = "tmx_record"

    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("tmx_document.id"))
    source: Mapped[str] = mapped_column()
    target: Mapped[str] = mapped_column()
    creation_date: Mapped[datetime] = mapped_column(default=datetime.now(UTC))
    change_date: Mapped[datetime] = mapped_column(default=datetime.now(UTC))

    document: Mapped["TmxDocument"] = relationship(back_populates="records")


Index(
    "trgm_tmx_src_idx",
    TmxRecord.source,
    postgresql_using="gist",
    postgresql_ops={"source": "gist_trgm_ops"},
)


class XliffDocument(Base):
    __tablename__ = "xliff_document"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"))
    original_document: Mapped[str] = mapped_column()
    processing_status: Mapped[str] = mapped_column()
    upload_time: Mapped[datetime] = mapped_column(default=datetime.now(UTC))

    records: Mapped[list["XliffRecord"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="XliffRecord.id",
    )
    user: Mapped["User"] = relationship(back_populates="xliffs")
    tmxs: Mapped[list["TmxDocument"]] = relationship(
        secondary=xliff_to_tmx_link, back_populates="xliffs", order_by="TmxDocument.id"
    )


class XliffRecord(Base):
    __tablename__ = "xliff_record"

    id: Mapped[int] = mapped_column(primary_key=True)
    segment_id: Mapped[int] = mapped_column()
    document_id: Mapped[int] = mapped_column(ForeignKey("xliff_document.id"))
    source: Mapped[str] = mapped_column()
    target: Mapped[str] = mapped_column()
    state: Mapped[str] = mapped_column()
    approved: Mapped[bool] = mapped_column()

    document: Mapped["XliffDocument"] = relationship(back_populates="records")


class DocumentTask(Base):
    __tablename__ = "document_task"

    id: Mapped[int] = mapped_column(primary_key=True)
    data: Mapped[str] = mapped_column()
    status: Mapped[str] = mapped_column()


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column(unique=True)
    role: Mapped[str] = mapped_column(default="user")
    disabled: Mapped[bool] = mapped_column(default=False)

    tmxs: Mapped[list["TmxDocument"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", order_by="TmxDocument.id"
    )
    xliffs: Mapped[list["XliffDocument"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", order_by="XliffDocument.id"
    )
    glossaries: Mapped[list["GlossaryDocument"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="GlossaryDocument.id",
    )
