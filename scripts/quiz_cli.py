#!/usr/bin/env python3
"""Tiny terminal quiz for AI Mastery Memory OS Pro."""
from __future__ import annotations
import argparse
import json
import random
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "cards.json"
PROGRESS_PATH = ROOT / ".ai_mastery_cli_progress.json"
DAY = 24 * 60 * 60


def load_data() -> dict:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def load_progress() -> dict:
    if PROGRESS_PATH.exists():
        return json.loads(PROGRESS_PATH.read_text(encoding="utf-8"))
    return {}


def save_progress(progress: dict) -> None:
    PROGRESS_PATH.write_text(json.dumps(progress, indent=2), encoding="utf-8")


def progress_for(progress: dict, card_id: str) -> dict:
    return progress.setdefault(card_id, {
        "reviews": 0,
        "reps": 0,
        "interval": 0,
        "ease": 2.5,
        "due": 0,
        "lapses": 0
    })


def grade(progress: dict, card_id: str, rating: int) -> None:
    p = progress_for(progress, card_id)
    now = int(time.time())
    p["reviews"] += 1
    p["lastRating"] = rating
    p["lastReviewed"] = now
    if rating < 3:
        p["lapses"] += 1
        p["reps"] = 0
        p["interval"] = 0
        p["ease"] = max(1.3, p["ease"] - 0.22)
        p["due"] = now + 10 * 60
    else:
        p["reps"] += 1
        p["ease"] = max(1.3, p["ease"] + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)))
        if p["reps"] == 1:
            p["interval"] = 1 if rating == 3 else 2 if rating == 4 else 3
        elif p["reps"] == 2:
            p["interval"] = 2 if rating == 3 else 4 if rating == 4 else 6
        else:
            multiplier = 1.25 if rating == 3 else p["ease"] if rating == 4 else p["ease"] * 1.35
            p["interval"] = max(1, round(max(1, p["interval"]) * multiplier))
        p["due"] = now + p["interval"] * DAY


def main() -> None:
    parser = argparse.ArgumentParser(description="Terminal quiz for AI Mastery Memory OS Pro")
    parser.add_argument("--level", choices=["Beginner", "Intermediate", "Advanced", "Expert"], help="Filter by level")
    parser.add_argument("--category", help="Filter by category")
    parser.add_argument("--count", type=int, default=10, help="Number of cards to review")
    args = parser.parse_args()

    data = load_data()
    progress = load_progress()
    cards = data["cards"]
    if args.level:
        cards = [c for c in cards if c["level"] == args.level]
    if args.category:
        cards = [c for c in cards if c["category"].lower() == args.category.lower()]

    now = int(time.time())
    due = [c for c in cards if progress_for(progress, c["id"])["reviews"] > 0 and progress_for(progress, c["id"])["due"] <= now]
    new = [c for c in cards if progress_for(progress, c["id"])["reviews"] == 0]
    queue = due + random.sample(new, min(len(new), max(0, args.count - len(due))))
    random.shuffle(queue)
    queue = queue[:args.count]

    if not queue:
        print("No cards match this filter or no due cards are available.")
        return

    print(f"AI Mastery Memory OS Pro CLI - {len(queue)} cards")
    print("Ratings: 1=Again, 2=Hard, 3=Good, 4=Easy. Press Ctrl+C to stop.\n")
    try:
        for i, card in enumerate(queue, start=1):
            p = progress_for(progress, card["id"])
            print("=" * 78)
            print(f"{i}/{len(queue)} | {card['level']} | {card['category']} | reviews={p['reviews']} ease={p['ease']:.2f}")
            print(f"\n{card['title']}")
            print(f"Q: {card['front']}")
            input("\nWrite/think your answer, then press Enter to reveal...")
            print(f"\nA: {card['back']}")
            print(f"Why: {card['whyItMatters']}")
            print(f"Example: {card['example']}")
            print(f"Connections: {', '.join(card['connections'])}")
            while True:
                raw = input("\nRate 1 Again / 2 Hard / 3 Good / 4 Easy: ").strip()
                if raw in {"1", "2", "3", "4"}:
                    rating = {"1": 1, "2": 3, "3": 4, "4": 5}[raw]
                    grade(progress, card["id"], rating)
                    save_progress(progress)
                    break
                print("Enter 1, 2, 3, or 4.")
        print("\nSession complete. Progress saved to .ai_mastery_cli_progress.json")
    except KeyboardInterrupt:
        save_progress(progress)
        print("\nStopped. Progress saved.")


if __name__ == "__main__":
    main()
