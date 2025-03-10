from dataclasses import dataclass


@dataclass
class SubstringPosition:
    start: int
    end: int
    substring: str = None
