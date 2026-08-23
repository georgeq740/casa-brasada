from pathlib import Path
from PIL import Image, ImageEnhance

SRC = Path(
    "/Users/jorgeluisquitianquitian/.cursor/projects/"
    "Users-jorgeluisquitianquitian-Projects-casa-brasada/assets"
)
OUT = Path(__file__).resolve().parents[1] / "assets" / "photos"
OUT.mkdir(parents=True, exist_ok=True)


def highlight_lut():
    lut = []
    for i in range(256):
        if i < 50:
            lut.append(min(255, int(i * 1.22 + 10)))
        elif i < 190:
            lut.append(int(50 * 1.22 + 10 + (i - 50) * 0.82))
        else:
            t = (i - 190) / 65
            lut.append(int(168 + t * 48))
    return lut


def grade(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size
    im = im.crop((int(w * 0.08), int(h * 0.10), int(w * 0.95), int(h * 0.95)))
    lut = highlight_lut()
    im = im.point(lut * 3)
    im = ImageEnhance.Brightness(im).enhance(0.94)
    im = ImageEnhance.Contrast(im).enhance(0.96)
    im = ImageEnhance.Color(im).enhance(0.86)
    im = ImageEnhance.Sharpness(im).enhance(1.08)
    return im


SHOTS = {
    "mesa-compartida.jpg": "WhatsApp_Image_2026-08-23_at_7.54.12_AM-28c3b033-70cb-4f38-963c-149258dc46d0.png",
    "plato-clasico.jpg": "WhatsApp_Image_2026-08-23_at_7.54.11_AM-47f6efc9-3e01-47f1-9768-a0549bc6612b.png",
    "picada-arepa.jpg": "WhatsApp_Image_2026-08-23_at_7.54.12_AM__5_-4f3ea0e7-d03f-41d0-bd23-9c2f02fd4f24.png",
    "tabla-brasa.jpg": "WhatsApp_Image_2026-08-23_at_7.54.12_AM__3_-c9b887e5-ddfb-42c1-990e-c9dee43a2397.png",
    "dos-bandejas.jpg": "WhatsApp_Image_2026-08-23_at_7.54.15_AM__2_-c520291a-2701-4874-9a48-6bf50604ef9c.png",
}

if __name__ == "__main__":
    for dest, name in SHOTS.items():
        graded = grade(Image.open(SRC / name))
        if dest == "plato-clasico.jpg":
            graded = graded.transpose(Image.ROTATE_180).transpose(Image.ROTATE_270)
        graded.save(OUT / dest, quality=88, optimize=True)
        print(dest, graded.size)
