from pydantic import BaseModel
from typing import List, Optional

class BuyLink(BaseModel):
    retailer: str
    url: str
    kind: str = "print"      # print | ebook
    price: Optional[str] = None

class ReadLink(BaseModel):
    platform: str
    url: str
    access: str = "free"     # free | borrow | public-domain

class Palette(BaseModel):
    dominant: str
    palette: List[str]

class Book(BaseModel):
    id: str
    title: str
    authors: List[str] = []
    cover_url: Optional[str] = None
    description: str = ""
    categories: List[str] = []
    published_year: Optional[int] = None
    page_count: Optional[int] = None
    rating: Optional[float] = None
    isbn: Optional[str] = None
    buy_links: List[BuyLink] = []
    read_links: List[ReadLink] = []
    palette: Optional[Palette] = None
