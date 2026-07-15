from __future__ import annotations

import json
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


SOURCE = Path(r"C:\Users\babys\Downloads\imd resources")
OUTPUT = Path(r"C:\Users\babys\OneDrive\文件\imd\tmp\pdfs\source_text")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    inventory: list[dict[str, object]] = []

    for pdf_path in sorted(SOURCE.glob("*.pdf")):
        reader = PdfReader(str(pdf_path))
        page_texts: list[str] = []
        page_char_counts: list[int] = []

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            page_texts.append(f"\n===== PAGE {page_number} =====\n{text.strip()}\n")
            page_char_counts.append(len(text))

        output_path = OUTPUT / f"{pdf_path.stem}.txt"
        output_path.write_text("".join(page_texts), encoding="utf-8")
        inventory.append(
            {
                "name": pdf_path.name,
                "path": str(pdf_path),
                "pages": len(reader.pages),
                "characters": sum(page_char_counts),
                "page_character_counts": page_char_counts,
                "text_path": str(output_path),
            }
        )

    for image_path in sorted(SOURCE.glob("*.jpeg")):
        with Image.open(image_path) as image:
            inventory.append(
                {
                    "name": image_path.name,
                    "path": str(image_path),
                    "width": image.width,
                    "height": image.height,
                    "mode": image.mode,
                }
            )

    inventory_path = OUTPUT.parent / "inventory.json"
    inventory_path.write_text(json.dumps(inventory, indent=2), encoding="utf-8")

    for item in inventory:
        if "pages" in item:
            pages = int(item["pages"])
            chars = int(item["characters"])
            print(
                f"{item['name']}\tpages={pages}\tchars={chars}"
                f"\tchars/page={chars // max(1, pages)}"
            )
        else:
            print(
                f"{item['name']}\t{item['width']}x{item['height']}"
                f"\tmode={item['mode']}"
            )


if __name__ == "__main__":
    main()
