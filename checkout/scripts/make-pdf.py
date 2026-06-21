#!/usr/bin/env python3
"""Generate a minimal valid PDF for the Agent OS Install Guide bundle.
Writes to public/bundles/agent-os-install-guide.pdf.
We construct the PDF by hand so there are zero external deps.
"""
import os
import sys

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "bundles", "agent-os-install-guide.pdf")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# Six logical lines per page — content streams.
LINES = [
    ("Agent OS Install Guide",          "/F1 24 Tf",          48,  700),
    ("v1.0  -  Skill Hub MRR Sprint",   "/F1 12 Tf",          48,  678),
    ("",                                "/F1 12 Tf",          48,  640),
    ("Built from the MoxBox Proxmox +", "/F1 13 Tf",          48,  620),
    ("DoraPad + WinBox mesh.",          "/F1 13 Tf",          48,  604),
    ("",                                "/F1 12 Tf",          48,  560),
    ("Sections:",                        "/F1 14 Tf",          48,  530),
    ("  1. Hardware shortlist",          "/F1 12 Tf",          48,  506),
    ("  2. Proxmox + ZFS bootstrap",     "/F1 12 Tf",          48,  490),
    ("  3. WireGuard mesh VPN",          "/F1 12 Tf",          48,  474),
    ("  4. .hermes/.env secrets vault",  "/F1 12 Tf",          48,  458),
    ("  5. Agent bootstrap script",      "/F1 12 Tf",          48,  442),
    ("  6. Daily-driver cheat sheet",    "/F1 12 Tf",          48,  426),
    ("",                                "/F1 12 Tf",          48,  390),
    ("Total pages in the real bundle: 24.", "/F1 11 Tf",      48,  370),
    ("This stub is shipped for the checkout MVP. ", "/F1 10 Tf",48, 350),
    ("Replace public/bundles/agent-os-install-guide.pdf",   "/F1 10 Tf",48, 336),
    ("with the full guide before the first sale.",          "/F1 10 Tf",48, 322),
    ("",                                "/F1 12 Tf",          48,  280),
    ("License: MIT-style. Commercial use OK. No reselling.", "/F1 10 Tf",48, 256),
    ("Contact: gsantana212@gmail.com",   "/F1 10 Tf",          48,  240),
]

def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

stream_parts = []
for text, font, x, y in LINES:
    stream_parts.append(f"BT {font} {x} {y} Td ({esc(text)}) Tj ET")
stream = "\n".join(stream_parts) + "\n"
stream_bytes = stream.encode("latin-1")

# Build PDF objects
obj1 = b"<< /Type /Catalog /Pages 2 0 R >>"
obj2 = b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>"
obj3 = (
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
    b"/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
)
obj4 = b"<< /Length %d >>\nstream\n" % len(stream_bytes) + stream_bytes + b"endstream"
obj5 = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"

objects = [obj1, obj2, obj3, obj4, obj5]

out = bytearray()
out += b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"  # binary marker so tools detect it as binary

offsets = [0]  # obj 0 is the free entry
for i, body in enumerate(objects, start=1):
    offsets.append(len(out))
    out += f"{i} 0 obj\n".encode("latin-1") + body + b"\nendobj\n"

xref_offset = len(out)
out += b"xref\n"
out += f"0 {len(objects) + 1}\n".encode("latin-1")
out += b"0000000000 65535 f \n"
for off in offsets[1:]:
    out += f"{off:010d} 00000 n \n".encode("latin-1")
out += b"trailer\n"
out += f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n".encode("latin-1")
out += b"startxref\n"
out += f"{xref_offset}\n".encode("latin-1")
out += b"%%EOF\n"

with open(OUT, "wb") as f:
    f.write(bytes(out))

print(f"Wrote {OUT} ({len(out)} bytes)")
sys.exit(0)