#!/usr/bin/env python3
"""
Servidor local para probar la web SIN el problema de caché del navegador.

`python3 -m http.server` no manda cabeceras de caché, así que Chrome/Safari
deciden por su cuenta cuánto tiempo guardar cada CSS/JS — y en una sesión de
pruebas larga (como esta) eso significa que a veces ves cambios de hace
varios días en vez de los que acabas de guardar, aunque hagas recargar la
página normal. Este servidor manda `Cache-Control: no-store` en cada
respuesta, así el navegador SIEMPRE pide el archivo entero de nuevo.

Uso: igual que el de siempre, desde la carpeta del proyecto:
    python3 servidor-local.py
y abre http://localhost:8420/ (o /marketing/, /asesoria/, etc.)
"""

import http.server
import socketserver

PUERTO = 8420


class SinCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


with socketserver.TCPServer(('', PUERTO), SinCacheHandler) as httpd:
    print(f'Sirviendo en http://localhost:{PUERTO}/ (sin caché — siempre ves la última versión)')
    print('Ctrl+C para parar.')
    httpd.serve_forever()
