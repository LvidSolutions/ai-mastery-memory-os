#!/usr/bin/env python3
"""LEGACY validator for the optional CLI quiz data (data/cards.json). The live app is validated by scripts/validate-app.js. Validate AI Mastery Memory OS Pro data and app files."""
from __future__ import annotations
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "cards.json"
JS_PATH = ROOT / "data" / "content.js"
APP_PATH = ROOT / "src" / "app.js"
INDEX_PATH = ROOT / "index.html"

REQUIRED = {
    "id", "level", "category", "type", "title", "front", "back",
    "whyItMatters", "example", "tags", "chunk", "connections", "practice"
}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if not DATA_PATH.exists():
        fail(f"Missing {DATA_PATH}")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    cards = data.get("cards", [])
    if len(cards) < 100:
        fail(f"Expected at least 100 cards, got {len(cards)}")
    ids = [card.get("id") for card in cards]
    if len(ids) != len(set(ids)):
        fail("Duplicate card IDs found")
    for i, card in enumerate(cards, start=1):
        missing = REQUIRED - set(card)
        if missing:
            fail(f"Card {i} missing fields: {sorted(missing)}")
        for key in ["id", "level", "category", "type", "title", "front", "back"]:
            if not str(card[key]).strip():
                fail(f"Card {card.get('id')} has empty {key}")
        if not isinstance(card["tags"], list) or not card["tags"]:
            fail(f"Card {card['id']} needs tags")
        if not isinstance(card["connections"], list):
            fail(f"Card {card['id']} connections must be a list")
    if not JS_PATH.exists() or "window.AI_MASTERY_DATA" not in JS_PATH.read_text(encoding="utf-8")[:100]:
        fail("content.js missing embedded data")
    if "AI_MASTERY_DATA" not in APP_PATH.read_text(encoding="utf-8"):
        fail("app.js does not reference embedded data")
    if "data/content.js" not in INDEX_PATH.read_text(encoding="utf-8"):
        fail("index.html does not load data/content.js")
    print(f"OK: {len(cards)} cards, {len(data.get('glossary', []))} glossary terms.")


if __name__ == "__main__":
    main()
