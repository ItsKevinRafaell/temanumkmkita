"""Generate full logo asset set from 6 SVG master files.

Reads:  /home/kevin/temanumkmkita/public/brand/master/*.svg
Writes: /home/kevin/temanumkmkita/public/brand/

Outputs:
  - 6 PNG raster (1024×256 lockup, 512/256/128 icon sizes)
  - 1 favicon.ico (16+32+48)
  - 4 favicon PNG (16, 32, 48)
  - 1 apple-touch-icon.png (180×180)
  - 2 android-chrome PNG (192, 512)
  - 1 og-image.png (1200×630)
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/home/kevin/temanumkmkita")
MASTER = ROOT / "public/brand/master"
OUT = ROOT / "public/brand"
MASTER.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

YELLOW_SVG = MASTER / "master logo icon yellow.svg"
PRIMARY_SVG = MASTER / "Master logo primary yellow.svg"
SECONDARY_SVG = MASTER / "master logo secondary yellow.svg"

# Lockup sizes (viewBox derived)
PRIMARY_PNG_SIZE = (1024, 512)  # 2:1
SECONDARY_PNG_SIZE = (1024, 256)  # 4:1
ICON_SIZES = [512, 256, 128, 64]

FAVICON_PNG_SIZES = [16, 32, 48]
APPLE_TOUCH_SIZE = 180
ANDROID_SIZES = [192, 512]

# OG image template colors
OG_BG = "#fcfaf7"
OG_ACCENT = "#f5a700"
OG_DARK = "#242423"
OG_SIZE = (1200, 630)


def svg_to_png(svg_path: Path, output_path: Path, size: tuple[int, int]) -> None:
    """Convert SVG to PNG at exact pixel size."""
    cairosvg.svg2png(
        url=str(svg_path),
        write_to=str(output_path),
        output_width=size[0],
        output_height=size[1],
    )
    print(f"  ✓ {output_path.name} ({size[0]}×{size[1]})")


def build_ico(icon_png: Path, ico_path: Path, sizes: list[int]) -> None:
    """Generate multi-size ICO file."""
    images = []
    for s in sizes:
        img = Image.open(icon_png).convert("RGBA")
        img = img.resize((s, s), Image.LANCZOS)
        images.append(img)
    images[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=images[1:],
    )
    print(f"  ✓ {ico_path.name} (multi-size {sizes})")


def build_og_image(icon_path: Path, output_path: Path) -> None:
    """Build OG image 1200×630: bg + icon + wordmark."""
    img = Image.new("RGB", OG_SIZE, OG_BG)
    draw = ImageDraw.Draw(img)

    # Icon at top-left, ~280px
    icon = Image.open(icon_path).convert("RGBA")
    icon_size = 280
    icon = icon.resize((icon_size, icon_size), Image.LANCZOS)
    icon_x, icon_y = 80, (OG_SIZE[1] - icon_size) // 2 - 30
    img.paste(icon, (icon_x, icon_y), icon)

    # Wordmark — try to load Inter, fallback to default
    font_path = "/usr/share/fonts/google-inter/Inter-Bold.ttf"
    if not os.path.exists(font_path):
        # Common alt paths
        for p in [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
        ]:
            if os.path.exists(p):
                font_path = p
                break
    try:
        font_large = ImageFont.truetype(font_path, 84)
        font_small = ImageFont.truetype(font_path, 36)
    except OSError:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    text_x = icon_x + icon_size + 50
    text_y = icon_y + 40
    draw.text((text_x, text_y), "Teman UMKM Kita", fill=OG_DARK, font=font_large)
    draw.text(
        (text_x, text_y + 110),
        "Solusi Digital untuk UMKM Indonesia",
        fill=OG_ACCENT,
        font=font_small,
    )

    # Accent stripe at bottom
    draw.rectangle([(0, OG_SIZE[1] - 12), (OG_SIZE[0], OG_SIZE[1])], fill=OG_ACCENT)

    img.save(output_path, "PNG", optimize=True)
    print(f"  ✓ {output_path.name} ({OG_SIZE[0]}×{OG_SIZE[1]})")


def main() -> int:
    print("=== Stage 1: PNG raster from SVG ===")
    # Primary lockup (yellow)
    svg_to_png(PRIMARY_SVG, OUT / "logo-primary-yellow.png", PRIMARY_PNG_SIZE)
    svg_to_png(MASTER / "Master logo primary white.svg", OUT / "logo-primary-white.png", PRIMARY_PNG_SIZE)
    # Secondary lockup
    svg_to_png(SECONDARY_SVG, OUT / "logo-secondary-yellow.png", SECONDARY_PNG_SIZE)
    svg_to_png(MASTER / "master logo secondary white.svg", OUT / "logo-secondary-white.png", SECONDARY_PNG_SIZE)
    # Icon — multiple sizes
    icon_yellow_512 = OUT / "logo-icon-yellow.png"
    svg_to_png(YELLOW_SVG, icon_yellow_512, (512, 512))
    for size in ICON_SIZES[1:]:
        img = Image.open(icon_yellow_512).resize((size, size), Image.LANCZOS)
        img.save(OUT / f"logo-icon-yellow-{size}.png", "PNG", optimize=True)
        print(f"  ✓ logo-icon-yellow-{size}.png")
    # White icon
    icon_white_512 = OUT / "logo-icon-white.png"
    svg_to_png(MASTER / "master logo icon white.svg", icon_white_512, (512, 512))
    for size in ICON_SIZES[1:]:
        img = Image.open(icon_white_512).resize((size, size), Image.LANCZOS)
        img.save(OUT / f"logo-icon-white-{size}.png", "PNG", optimize=True)
        print(f"  ✓ logo-icon-white-{size}.png")

    print("\n=== Stage 2: Favicon set ===")
    for size in FAVICON_PNG_SIZES:
        img = Image.open(icon_yellow_512).resize((size, size), Image.LANCZOS)
        img.save(OUT / f"favicon-{size}.png", "PNG", optimize=True)
        print(f"  ✓ favicon-{size}.png")
    build_ico(icon_yellow_512, ROOT / "public/favicon.ico", FAVICON_PNG_SIZES)

    print("\n=== Stage 3: PWA icons ===")
    apple = Image.open(icon_yellow_512).resize((APPLE_TOUCH_SIZE, APPLE_TOUCH_SIZE), Image.LANCZOS)
    apple.save(OUT / "apple-touch-icon.png", "PNG", optimize=True)
    print(f"  ✓ apple-touch-icon.png ({APPLE_TOUCH_SIZE}×{APPLE_TOUCH_SIZE})")
    for size in ANDROID_SIZES:
        img = Image.open(icon_yellow_512).resize((size, size), Image.LANCZOS)
        img.save(OUT / f"android-chrome-{size}x{size}.png", "PNG", optimize=True)
        print(f"  ✓ android-chrome-{size}x{size}.png")

    print("\n=== Stage 4: OG image ===")
    build_og_image(icon_yellow_512, OUT / "og-image.png")

    print("\n=== Done ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())