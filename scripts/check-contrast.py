from __future__ import annotations


def channel(value: int) -> float:
    value /= 255
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def luminance(color: str) -> float:
    rgb = [int(color[i : i + 2], 16) for i in (1, 3, 5)]
    r, g, b = (channel(value) for value in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(first: str, second: str) -> float:
    one, two = luminance(first), luminance(second)
    light, dark = max(one, two), min(one, two)
    return (light + 0.05) / (dark + 0.05)

pairs = [
    ("body text on purple", "#F7F6FA", "#14052B"),
    ("yellow label on purple", "#FFB000", "#14052B"),
    ("purple text on cream", "#14052B", "#F7F6FA"),
    ("white CTA text on green", "#FFFFFF", "#0B7D46"),
    ("green price on cream", "#0B7D46", "#F7F6FA"),
    ("accessible green CTA", "#FFFFFF", "#0B7D46"),
    ("chat input text on white", "#14052B", "#FFFFFF"),
    ("chat option text on white", "#14052B", "#FFFFFF"),
    ("chat focus green on white", "#0B7D46", "#FFFFFF"),
    ("chat bubble text", "#14052B", "#E9E5F0"),
    ("chat placeholder on white", "#62536F", "#FFFFFF"),
    ("chat question label on cream", "#62536F", "#F7F6FA"),
]
for label, foreground, background in pairs:
    ratio = contrast(foreground, background)
    level = "AAA" if ratio >= 7 else "AA" if ratio >= 4.5 else "AA large" if ratio >= 3 else "fail"
    print(f"{label}: {ratio:.2f}:1 ({level})")
