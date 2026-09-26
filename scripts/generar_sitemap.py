#!/usr/bin/env python3
"""
Regenera sitemap.xml a partir de la lista de páginas reales del sitio.

El sitio es HTML estático sin build, así que este script no se ejecuta
automáticamente: córrelo a mano (o desde un pre-commit / paso manual)
cada vez que se añada, quite o cambie de importancia una página, justo
antes de publicar.

Uso:
    python3 scripts/generar_sitemap.py
"""

import datetime
from pathlib import Path

DOMINIO = "https://www.asesores360.com"
RAIZ = Path(__file__).resolve().parent.parent
HOY = datetime.date.today().isoformat()

# (ruta relativa al dominio, changefreq, priority)
# Mantener esta lista a mano: es intencional, para no incluir por
# accidente páginas que no deben indexarse (404.html, anclas de
# legal.html, etc.)
PAGINAS = [
    ("/", "weekly", "1.0"),
    ("/asesoria/", "weekly", "0.9"),
    ("/asesoria/nosotros.html", "monthly", "0.7"),
    ("/asesoria/servicios.html", "monthly", "0.8"),
    ("/asesoria/contacto.html", "monthly", "0.8"),
    ("/marketing/", "weekly", "0.9"),
    ("/marketing/nosotros.html", "monthly", "0.7"),
    ("/marketing/servicios.html", "monthly", "0.8"),
    ("/marketing/contacto.html", "monthly", "0.8"),
    ("/legal.html", "yearly", "0.3"),
]


def generar():
    lineas = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for ruta, changefreq, priority in PAGINAS:
        lineas.append(
            f"  <url><loc>{DOMINIO}{ruta}</loc><lastmod>{HOY}</lastmod>"
            f"<changefreq>{changefreq}</changefreq><priority>{priority}</priority></url>"
        )
    lineas.append("</urlset>")
    return "\n".join(lineas) + "\n"


def main():
    contenido = generar()
    destino = RAIZ / "sitemap.xml"
    destino.write_text(contenido, encoding="utf-8")
    print(f"sitemap.xml regenerado con {len(PAGINAS)} páginas, lastmod={HOY}")
    print(f"-> {destino}")


if __name__ == "__main__":
    main()
