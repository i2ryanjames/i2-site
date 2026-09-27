"""Local-only static preview with the site's Vercel routes and security headers.

Serves public/ only. Contact requests are not forwarded or sent.
"""
import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'vercel.json').read_text())
REWRITES = {row['source']: row['destination'] for row in CONFIG['rewrites']}
HEADERS = CONFIG['headers'][0]['headers']


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'public'), **kwargs)

    def translate_path(self, path):
        pathname = urlsplit(path).path
        return super().translate_path(REWRITES.get(pathname, path))

    def end_headers(self):
        for header in HEADERS:
            value = header['value']
            if header['key'] == 'Content-Security-Policy':
                value = value.replace('; upgrade-insecure-requests', '')
            self.send_header(header['key'], value)
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if urlsplit(self.path).path.startswith('/api/'):
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"ok":false,"message":"Contact delivery is disabled in the local preview."}')
            return
        super().do_GET()

    def do_POST(self):
        self.send_error(405, 'The local preview does not send form submissions.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8789)
    args = parser.parse_args()
    server = ThreadingHTTPServer(('127.0.0.1', args.port), PreviewHandler)
    print(f'Local preview: http://127.0.0.1:{args.port}', flush=True)
    server.serve_forever()
