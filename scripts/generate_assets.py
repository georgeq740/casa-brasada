from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "assets" / "icons"
SOCIAL = ROOT / "assets" / "social"
ICONS.mkdir(parents=True, exist_ok=True)
SOCIAL.mkdir(parents=True, exist_ok=True)


def flame_icon(size: int, path: Path) -> None:
    img = Image.new("RGB", (size, size), "#120d0b")
    draw = ImageDraw.Draw(img)
    pad = size * 0.12
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=size * 0.22, fill="#120d0b")
    draw.ellipse((pad, pad, size - pad, size - pad), fill="#1b1411")
    flame = [
        (size * 0.50, size * 0.16),
        (size * 0.68, size * 0.42),
        (size * 0.72, size * 0.62),
        (size * 0.50, size * 0.84),
        (size * 0.28, size * 0.62),
        (size * 0.34, size * 0.40),
    ]
    draw.polygon(flame, fill="#ff6a1f")
    inner = [
        (size * 0.50, size * 0.38),
        (size * 0.60, size * 0.58),
        (size * 0.50, size * 0.74),
        (size * 0.40, size * 0.58),
    ]
    draw.polygon(inner, fill="#ffd29a")
    img.save(path)


def og_image() -> None:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), "#120d0b")
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, h - 18, w, h), fill="#ff6a1f")
    draw.ellipse((-120, -180, 420, 360), fill="#1b1411")
    draw.polygon([(160, 90), (250, 230), (270, 340), (160, 460), (60, 330), (90, 210)], fill="#ff6a1f")
    try:
        title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", 92)
        body = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", 36)
    except OSError:
        title = ImageFont.load_default()
        body = title
    draw.text((430, 190), "Casa Brasada", font=title, fill="#f6eee2")
    draw.text((430, 310), "El fuego que celebra", font=body, fill="#d4a054")
    draw.text((430, 370), "Asados & celebraciones en Bogotá", font=body, fill="#c9b8a8")
    img.save(SOCIAL / "og-image.jpg", quality=90)


if __name__ == "__main__":
    flame_icon(192, ICONS / "icon-192.png")
    flame_icon(512, ICONS / "icon-512.png")
    flame_icon(180, ICONS / "apple-touch-icon.png")
    og_image()
    print("assets ready")
