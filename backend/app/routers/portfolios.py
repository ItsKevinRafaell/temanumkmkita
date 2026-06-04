import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Portfolio
from app.schemas import PortfolioCreate, PortfolioUpdate, PortfolioOut
from app.core.security import require_auth
from app.core.utils import now_iso

router = APIRouter(prefix="/api/portfolios", tags=["portfolios"])


@router.get("", response_model=list[PortfolioOut])
def list_portfolios(
    service_slug: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Portfolio)
    if service_slug:
        q = q.filter(Portfolio.service_slug == service_slug)
    return q.order_by(Portfolio.sort_order, Portfolio.created_at).all()


@router.get("/{portfolio_id}", response_model=PortfolioOut)
def get_portfolio(portfolio_id: str, db: Session = Depends(get_db)):
    item = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return item


@router.post("", response_model=PortfolioOut, dependencies=[Depends(require_auth)])
def create_portfolio(data: PortfolioCreate, db: Session = Depends(get_db)):
    item = Portfolio(id=str(uuid.uuid4()), created_at=now_iso(), **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{portfolio_id}", response_model=PortfolioOut, dependencies=[Depends(require_auth)])
def update_portfolio(portfolio_id: str, data: PortfolioUpdate, db: Session = Depends(get_db)):
    item = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{portfolio_id}", dependencies=[Depends(require_auth)])
def delete_portfolio(portfolio_id: str, db: Session = Depends(get_db)):
    item = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
