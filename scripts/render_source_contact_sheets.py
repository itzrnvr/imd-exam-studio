from __future__ import annotations

import math
from pathlib import Path

from pdf2image import convert_from_path
from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader


SOURCE = Path(r"C:\Users\babys\Downloads\imd resources")
OUTPUT = Path(r"C:\Users\babys\OneDrive\文件\imd\tmp\pdfs\contact_sheets")
POPPLER = Path(
    r"C:\Users\babys\.cache\codex-runtimes\codex-primary-runtime"
    r"\dependencies\native\poppler\Library\bin"
)

PDF_NAMES = [
    "Activation_funtions_CNN_Models.pdf",
    "CNN_Models.pdf",
    "GAN.pdf",
    "L3_L4_Image Data_Convolution.pdf",
    "LSTM_GRU.pdf",
    "RNN.pdf",
    "The Attention Mechanism.pdf",
    "Vision_transformer_U-Net.pdf",
    "XAI_transferLearning_LLM.pdf",
    "Adversarial_Attack.pdf",
    "Regularization.pdf",
]

COLS = 3
ROWS = 3
PAGES_PER_SHEET = COLS * ROWS
SHEET_WIDTH = 1800
SHEET_HEIGHT = 1200
MARGIN = 18
GAP = 12
LABEL_HEIGHT = 30


def fit_image(image: Image.Image, width: int, height: int) -> Image.Image:
    copy = image.copy()
    copy.thumbnail((width, height), Image.Resampling.LANCZOS)
    return copy


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default(size=20)

    cell_width = (SHEET_WIDTH - 2 * MARGIN - (COLS - 1) * GAP) // COLS
    cell_height = (SHEET_HEIGHT - 2 * MARGIN - (ROWS - 1) * GAP) // ROWS
    image_height = cell_height - LABEL_HEIGHT

    for pdf_name in PDF_NAMES:
        pdf_path = SOURCE / pdf_name
        if not pdf_path.exists():
            continue

        page_count = len(PdfReader(str(pdf_path)).pages)
        file_output = OUTPUT / pdf_path.stem
        file_output.mkdir(parents=True, exist_ok=True)

        for start_page in range(1, page_count + 1, PAGES_PER_SHEET):
            end_page = min(page_count, start_page + PAGES_PER_SHEET - 1)
            images = convert_from_path(
                str(pdf_path),
                dpi=100,
                first_page=start_page,
                last_page=end_page,
                fmt="jpeg",
                jpegopt={"quality": 72, "progressive": True, "optimize": True},
                poppler_path=str(POPPLER),
                thread_count=2,
            )

            sheet = Image.new("RGB", (SHEET_WIDTH, SHEET_HEIGHT), "#eceff4")
            draw = ImageDraw.Draw(sheet)

            for offset, page_image in enumerate(images):
                row, col = divmod(offset, COLS)
                x = MARGIN + col * (cell_width + GAP)
                y = MARGIN + row * (cell_height + GAP)
                page_number = start_page + offset

                draw.rounded_rectangle(
                    (x, y, x + cell_width, y + cell_height),
                    radius=8,
                    fill="white",
                    outline="#9aa3b2",
                    width=2,
                )
                draw.text(
                    (x + 10, y + 4),
                    f"Page {page_number}",
                    fill="#111827",
                    font=font,
                )

                fitted = fit_image(page_image, cell_width - 12, image_height - 8)
                image_x = x + (cell_width - fitted.width) // 2
                image_y = y + LABEL_HEIGHT + (image_height - fitted.height) // 2
                sheet.paste(fitted, (image_x, image_y))

            sheet_number = math.ceil(start_page / PAGES_PER_SHEET)
            output_path = file_output / f"sheet_{sheet_number:02d}_pages_{start_page:03d}-{end_page:03d}.jpg"
            sheet.save(output_path, quality=88, optimize=True)
            print(f"{pdf_path.stem}: {start_page}-{end_page}")


if __name__ == "__main__":
    main()
