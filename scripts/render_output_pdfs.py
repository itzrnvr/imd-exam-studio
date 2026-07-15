from __future__ import annotations

import math
from pathlib import Path

from pdf2image import convert_from_path
from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader


ROOT = Path(r"C:\Users\babys\OneDrive\文件\imd")
SOURCE = ROOT / "output" / "pdf"
OUTPUT = ROOT / "tmp" / "pdfs" / "output_contact_sheets_final"
POPPLER = Path(
    r"C:\Users\babys\.cache\codex-runtimes\codex-primary-runtime"
    r"\dependencies\native\poppler\Library\bin"
)

COLS = 3
ROWS = 3
PAGES_PER_SHEET = COLS * ROWS
SHEET_WIDTH = 2100
SHEET_HEIGHT = 1500
MARGIN = 20
GAP = 14
LABEL_HEIGHT = 34


def fit_image(image: Image.Image, width: int, height: int) -> Image.Image:
    page = image.copy()
    page.thumbnail((width, height), Image.Resampling.LANCZOS)
    return page


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default(size=22)
    cell_width = (SHEET_WIDTH - 2 * MARGIN - (COLS - 1) * GAP) // COLS
    cell_height = (SHEET_HEIGHT - 2 * MARGIN - (ROWS - 1) * GAP) // ROWS
    image_height = cell_height - LABEL_HEIGHT

    for pdf_path in sorted(SOURCE.glob("*.pdf")):
        page_count = len(PdfReader(str(pdf_path)).pages)
        doc_output = OUTPUT / pdf_path.stem
        doc_output.mkdir(parents=True, exist_ok=True)

        for start_page in range(1, page_count + 1, PAGES_PER_SHEET):
            end_page = min(page_count, start_page + PAGES_PER_SHEET - 1)
            pages = convert_from_path(
                str(pdf_path),
                dpi=120,
                first_page=start_page,
                last_page=end_page,
                fmt="jpeg",
                jpegopt={"quality": 78, "progressive": True, "optimize": True},
                poppler_path=str(POPPLER),
                thread_count=2,
            )

            sheet = Image.new("RGB", (SHEET_WIDTH, SHEET_HEIGHT), "#e8edf5")
            draw = ImageDraw.Draw(sheet)
            for offset, page_image in enumerate(pages):
                row, col = divmod(offset, COLS)
                x = MARGIN + col * (cell_width + GAP)
                y = MARGIN + row * (cell_height + GAP)
                page_number = start_page + offset
                draw.rounded_rectangle(
                    (x, y, x + cell_width, y + cell_height),
                    radius=9,
                    fill="white",
                    outline="#8090a8",
                    width=2,
                )
                draw.text((x + 10, y + 5), f"Page {page_number}", fill="#172033", font=font)
                fitted = fit_image(page_image, cell_width - 12, image_height - 10)
                image_x = x + (cell_width - fitted.width) // 2
                image_y = y + LABEL_HEIGHT + (image_height - fitted.height) // 2
                sheet.paste(fitted, (image_x, image_y))

            sheet_number = math.ceil(start_page / PAGES_PER_SHEET)
            path = doc_output / f"sheet_{sheet_number:02d}_pages_{start_page:03d}-{end_page:03d}.jpg"
            sheet.save(path, quality=90, optimize=True)
            print(path.relative_to(ROOT).as_posix())


if __name__ == "__main__":
    main()
