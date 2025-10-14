from typing import Tuple


def paginate(page: int, size: int) -> Tuple[int, int]:
    """Return (offset, limit) given page and size with sane bounds."""
    page = max(1, int(page or 1))
    size = max(1, min(int(size or 20), 100))
    return ( (page - 1) * size, size )
