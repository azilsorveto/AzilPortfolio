#!/usr/bin/env python3
"""
Resize/crop assets/images/Thumbnail.png -> assets/images/og-image.png (1200x630)
Requires: Pillow
Usage:
  python scripts/generate_og_image.py
"""
from PIL import Image, ImageOps
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / 'assets' / 'images' / 'Thumbnail.png'
DST = Path(__file__).resolve().parents[1] / 'assets' / 'images' / 'og-image.png'
SIZES = {
    'og-image.png': (1200, 630),
    'og-image-square.png': (1200, 1200),
}

if not SRC.exists():
    print(f"Source not found: {SRC}")
    raise SystemExit(1)

src_img = Image.open(SRC).convert('RGBA')

for name, size in SIZES.items():
    out = Path(__file__).resolve().parents[1] / 'assets' / 'images' / name
    img = ImageOps.fit(src_img, size, method=Image.LANCZOS, centering=(0.5, 0.5))
    if img.mode in ('RGBA', 'LA'):
        bg = Image.new('RGB', size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        bg.save(out, format='PNG', optimize=True)
    else:
        img.convert('RGB').save(out, format='PNG', optimize=True)
    print(f"Saved {out} ({size[0]}x{size[1]})")
