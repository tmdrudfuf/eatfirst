# Placeholder Eat First icon set: white check on green. Regenerate with: python scripts/make_icons.py
from PIL import Image, ImageDraw

GREEN = (46, 125, 50, 255)
WHITE = (255, 255, 255, 255)
OUT = 'assets/images/'

def check(size, scale, color, bg=None, ss=4):
    """Checkmark centered in a size x size canvas, occupying `scale` of the width."""
    S = size * ss
    im = Image.new('RGBA', (S, S), bg or (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    w = S * scale
    x0, y0 = (S - w) / 2, (S - w * 0.78) / 2
    pts = [(x0, y0 + w * 0.42), (x0 + w * 0.36, y0 + w * 0.76), (x0 + w, y0 + w * 0.02)]
    d.line(pts, fill=color, width=int(w * 0.17), joint='curve')
    r = w * 0.085
    for x, y in (pts[0], pts[2]):
        d.ellipse([x - r, y - r, x + r, y + r], fill=color)
    return im.resize((size, size), Image.LANCZOS)

check(1024, 0.56, WHITE, GREEN).save(OUT + 'icon.png')
Image.new('RGBA', (512, 512), GREEN).save(OUT + 'android-icon-background.png')
check(512, 0.36, WHITE).save(OUT + 'android-icon-foreground.png')  # adaptive safe zone = inner 66%
check(432, 0.36, WHITE).save(OUT + 'android-icon-monochrome.png')
check(228, 0.55, WHITE).save(OUT + 'splash-icon.png')  # Android 12+ masks splash icons to a circle
check(96, 0.8, WHITE).save(OUT + 'notification-icon.png')
check(48, 0.6, WHITE, GREEN).save(OUT + 'favicon.png')
