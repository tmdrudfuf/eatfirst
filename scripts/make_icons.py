# Eat First icon set: fork | fridge (check on the door) | spoon. Regenerate with: python scripts/make_icons.py
from PIL import Image, ImageDraw

GREEN = (46, 125, 50, 255)
WHITE = (255, 255, 255, 255)
CLEAR = (0, 0, 0, 0)  # ImageDraw writes pixels directly, so drawing CLEAR cuts holes
OUT = 'assets/images/'
SS = 4  # supersampling


def draw(size, bg=CLEAR, detail=GREEN, zoom=1.0):
    """Artwork in unit coordinates (0..1), sized for the adaptive-icon safe zone at zoom=1.
    `detail` colors the door line, handles and check: GREEN on a green background, CLEAR for
    single-color icons (themed/notification) where details must be see-through."""
    S = size * SS
    img = Image.new('RGBA', (S, S), bg)
    d = ImageDraw.Draw(img)
    P = lambda v: (0.5 + (v - 0.5) * zoom) * S  # position
    L = lambda v: v * zoom * S  # length
    box = lambda a, b, c, e: [P(a), P(b), P(c), P(e)]

    # fridge
    x0, y0, x1, y1 = 0.385, 0.26, 0.615, 0.74
    w, h = x1 - x0, y1 - y0
    split = y0 + h * 0.3
    d.rounded_rectangle(box(x0, y0, x1, y1), radius=L(w * 0.17), fill=WHITE)
    d.rectangle(box(x0, split - h * 0.017, x1, split + h * 0.017), fill=detail)
    hw, hx = w * 0.08, x0 + w * 0.16
    d.rounded_rectangle(box(hx, y0 + h * 0.09, hx + hw, split - h * 0.08), radius=L(hw / 2), fill=detail)
    d.rounded_rectangle(box(hx, split + h * 0.08, hx + hw, split + h * 0.32), radius=L(hw / 2), fill=detail)

    # check on the lower door
    cx, cy, cw, sw = 0.515, (split + y1) / 2, 0.1, 0.028
    pts = [(P(cx - cw * 0.5), P(cy + cw * 0.02)), (P(cx - cw * 0.14), P(cy + cw * 0.34)), (P(cx + cw * 0.5), P(cy - cw * 0.32))]
    d.line(pts, fill=detail, width=int(L(sw)), joint='curve')
    for x, y in (pts[0], pts[2]):
        r = L(sw) / 2
        d.ellipse([x - r, y - r, x + r, y + r], fill=detail)

    # fork (left) and spoon (right), length U, centred vertically
    U, top = 0.36, 0.5 - 0.36 / 2
    uw = U * 0.085
    fx, head = 0.29, U * 0.26
    tw = head * 0.2
    for i in range(3):
        x = fx - head / 2 + i * (head - tw) / 2
        d.rounded_rectangle(box(x, top, x + tw, top + U * 0.3), radius=L(tw / 2), fill=WHITE)
    d.rounded_rectangle(box(fx - head / 2, top + U * 0.22, fx + head / 2, top + U * 0.38), radius=L(head * 0.45), fill=WHITE)
    d.rounded_rectangle(box(fx - uw / 2, top + U * 0.3, fx + uw / 2, top + U), radius=L(uw / 2), fill=WHITE)
    sx, bw, bh = 0.71, U * 0.3, U * 0.4
    d.ellipse(box(sx - bw / 2, top, sx + bw / 2, top + bh), fill=WHITE)
    d.rounded_rectangle(box(sx - uw / 2, top + bh * 0.7, sx + uw / 2, top + U), radius=L(uw / 2), fill=WHITE)

    return img.resize((size, size), Image.LANCZOS)


draw(1024, bg=GREEN, zoom=1.3).save(OUT + 'icon.png')  # full square (legacy + Play listing)
Image.new('RGBA', (512, 512), GREEN).save(OUT + 'android-icon-background.png')
draw(512).save(OUT + 'android-icon-foreground.png')
draw(432, detail=CLEAR).save(OUT + 'android-icon-monochrome.png')
draw(288, zoom=1.15).save(OUT + 'splash-icon.png')  # Android 12+ masks splash icons to a circle
draw(96, detail=CLEAR, zoom=1.75).save(OUT + 'notification-icon.png')
draw(48, bg=GREEN, zoom=1.3).save(OUT + 'favicon.png')

# Play Store listing assets
import os
from PIL import ImageFont

os.makedirs('store', exist_ok=True)
draw(512, bg=GREEN, zoom=1.3).convert('RGB').save('store/icon-512.png')

fg = Image.new('RGB', (1024, 500), GREEN[:3])
art = draw(420, zoom=1.45)
fg.paste(art, (40, 40), art)
try:
    bold = ImageFont.truetype('arialbd.ttf', 96)
    regular = ImageFont.truetype('arial.ttf', 44)
except OSError:
    bold = regular = ImageFont.load_default()
d = ImageDraw.Draw(fg)
d.text((470, 175), 'Eat First', font=bold, fill=WHITE)
d.text((474, 295), "Your fridge's to-do list.", font=regular, fill=(232, 245, 233))
fg.save('store/feature-graphic.png')
