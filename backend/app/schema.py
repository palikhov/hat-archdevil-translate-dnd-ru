from datetime import datetime, UTC

from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped
from sqlalchemy.orm import mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TmxDocument(Base):
    __tablename__ = "tmx_document"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()

    records: Mapped[list["TmxRecord"]] = relationship(
        back_populates="document", cascade="all, delete-orphan", order_by="TmxRecord.id"
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


class XliffDocument(Base):
    __tablename__ = "xliff_document"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    original_document: Mapped[str] = mapped_column()
    processing_status: Mapped[str] = mapped_column()
    upload_time: Mapped[datetime] = mapped_column(default=datetime.now(UTC))

    records: Mapped[list["XliffRecord"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="XliffRecord.id",
    )


class XliffRecord(Base):
    __tablename__ = "xliff_record"

    id: Mapped[int] = mapped_column(primary_key=True)
    segment_id: Mapped[int] = mapped_column()
    document_id: Mapped[int] = mapped_column(ForeignKey("xliff_document.id"))
    source: Mapped[str] = mapped_column()
    target: Mapped[str] = mapped_column()

    document: Mapped["XliffDocument"] = relationship(back_populates="records")


class DocumentTask(Base):
    __tablename__ = "document_task"

    id: Mapped[int] = mapped_column(primary_key=True)
    data: Mapped[str] = mapped_column()
    status: Mapped[str] = mapped_column()
