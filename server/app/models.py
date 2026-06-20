import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ENUM

from app.database import Base


class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPLIED = "APPLIED"
    ASSESSMENT = "ASSESSMENT"
    INTERVIEW = "INTERVIEW"
    OFFERED = "OFFERED"
    REJECTED = "REJECTED"
    ACCEPTED = "ACCEPTED"
    ARCHIVED = "ARCHIVED"


class FeedbackType(str, enum.Enum):
    BUG = "BUG"
    SUGGESTION = "SUGGESTION"
    OTHER = "OTHER"


class FeedbackStatus(str, enum.Enum):
    PENDING = "PENDING"
    REVIEWED = "REVIEWED"
    IMPLEMENTED = "IMPLEMENTED"
    CLOSED = "CLOSED"


job_board_entry_tags = Table(
    "_JobBoardEntryToJobBoardTag",
    Base.metadata,
    Column("A", Integer, ForeignKey("JobBoardEntry.id"), primary_key=True),
    Column("B", Integer, ForeignKey("JobBoardTag.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "User"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String, nullable=True)
    password: Mapped[str | None] = mapped_column(String, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verificationToken: Mapped[str | None] = mapped_column(String, nullable=True)
    verificationExpiresAt: Mapped[datetime | None] = mapped_column(DateTime(timezone=False), nullable=True)
    setupCompleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    lastLoginAt: Mapped[datetime | None] = mapped_column(DateTime(timezone=False), nullable=True)

    sessions: Mapped[list["AuthSession"]] = relationship(back_populates="user")
    job_board_entries: Mapped[list["JobBoardEntry"]] = relationship(back_populates="user")
    job_board_tags: Mapped[list["JobBoardTag"]] = relationship(back_populates="user")
    feedback_entries: Mapped[list["FeedbackEntry"]] = relationship(back_populates="user")
    job_board_entry_notes: Mapped[list["JobBoardEntryNotes"]] = relationship(back_populates="user")


class AuthSession(Base):
    __tablename__ = "Session"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    userId: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False, index=True)
    token: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    expiresAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)

    user: Mapped["User"] = relationship(back_populates="sessions")


class JobBoardEntry(Base):
    __tablename__ = "JobBoardEntry"
    __table_args__ = (
        UniqueConstraint("userId", "status", "number"),
        Index("JobBoardEntry_title_idx", "title"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    salary: Mapped[str | None] = mapped_column(String, nullable=True)
    url: Mapped[str | None] = mapped_column(String, nullable=True)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    status: Mapped[JobStatus] = mapped_column(
        ENUM(JobStatus, name="JobStatus", create_type=False),
        default=JobStatus.PENDING,
        nullable=False,
    )
    userId: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)
    company: Mapped[str] = mapped_column(String, nullable=False)
    coverLetterText: Mapped[str | None] = mapped_column(Text, nullable=True)
    coverLetterKey: Mapped[str | None] = mapped_column(String, nullable=True)
    coverLetterFilename: Mapped[str | None] = mapped_column(String, nullable=True)
    cvText: Mapped[str | None] = mapped_column(Text, nullable=True)
    cvKey: Mapped[str | None] = mapped_column(String, nullable=True)
    cvFilename: Mapped[str | None] = mapped_column(String, nullable=True)
    closingDate: Mapped[datetime | None] = mapped_column(DateTime(timezone=False), nullable=True)

    user: Mapped["User"] = relationship(back_populates="job_board_entries")
    job_board_tags: Mapped[list["JobBoardTag"]] = relationship(
        secondary=job_board_entry_tags,
        back_populates="job_board_entries",
    )
    job_board_entry_notes: Mapped[list["JobBoardEntryNotes"]] = relationship(back_populates="job_board_entry")


class JobBoardTag(Base):
    __tablename__ = "JobBoardTag"
    __table_args__ = (
        UniqueConstraint("userId", "name"),
        Index("JobBoardTag_name_idx", "name"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    userId: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="job_board_tags")
    job_board_entries: Mapped[list["JobBoardEntry"]] = relationship(
        secondary=job_board_entry_tags,
        back_populates="job_board_tags",
    )


class FeedbackEntry(Base):
    __tablename__ = "FeedbackEntry"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    userId: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[FeedbackType] = mapped_column(
        ENUM(FeedbackType, name="FeedbackType", create_type=False),
        default=FeedbackType.OTHER,
        nullable=False,
    )
    status: Mapped[FeedbackStatus] = mapped_column(
        ENUM(FeedbackStatus, name="FeedbackStatus", create_type=False),
        default=FeedbackStatus.PENDING,
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="feedback_entries")


class JobBoardEntryNotes(Base):
    __tablename__ = "JobBoardEntryNotes"
    __table_args__ = (Index("JobBoardEntryNotes_userId_jobBoardEntryId_idx", "userId", "jobBoardEntryId"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    userId: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    jobBoardEntryId: Mapped[int] = mapped_column(ForeignKey("JobBoardEntry.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="job_board_entry_notes")
    job_board_entry: Mapped["JobBoardEntry"] = relationship(back_populates="job_board_entry_notes")
