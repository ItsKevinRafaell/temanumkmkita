import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import asyncio
import io

ALLOWED_ORIGINS = [
    "https://temanumkmkita.com",
    "https://www.temanumkmkita.com",
    "http://localhost:3000",
]

def application(environ, start_response):
    from main import app

    scope = {
        'type': 'http',
        'asgi': {'version': '3.0'},
        'http_version': '1.1',
        'method': environ['REQUEST_METHOD'].upper(),
        'headers': [],
        'path': environ.get('PATH_INFO', '/'),
        'query_string': environ.get('QUERY_STRING', '').encode(),
        'root_path': '',
        'server': (environ.get('SERVER_NAME', 'localhost'), int(environ.get('SERVER_PORT', 80))),
    }

    for key, val in environ.items():
        if key.startswith('HTTP_'):
            scope['headers'].append((key[5:].lower().replace('_', '-').encode(), val.encode()))
    for key in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
        if environ.get(key):
            scope['headers'].append((key.lower().replace('_', '-').encode(), environ[key].encode()))

    content_length = int(environ.get('CONTENT_LENGTH') or 0)
    wsgi_input = environ.get('wsgi.input', io.BytesIO())
    body = wsgi_input.read(content_length) if content_length > 0 else b''
    result = {'status': '500 Internal Server Error', 'headers': [], 'body': []}

    async def run():
        async def receive():
            return {'type': 'http.request', 'body': body, 'more_body': False}

        async def send(message):
            if message['type'] == 'http.response.start':
                phrases = {200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request',
                           401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
                           405: 'Method Not Allowed', 422: 'Unprocessable Entity', 500: 'Internal Server Error'}
                code = message['status']
                result['status'] = f"{code} {phrases.get(code, 'Unknown')}"
                result['headers'] = [(k.decode(), v.decode()) for k, v in message.get('headers', [])]
            elif message['type'] == 'http.response.body':
                result['body'].append(message.get('body', b''))

        try:
            await app(scope, receive, send)
        except Exception:
            import traceback
            traceback.print_exc()
            origin = dict(scope['headers']).get(b'origin', b'').decode()
            cors_headers = []
            if origin in ALLOWED_ORIGINS:
                cors_headers = [
                    ('Access-Control-Allow-Origin', origin),
                    ('Access-Control-Allow-Credentials', 'true'),
                ]
            result['status'] = '500 Internal Server Error'
            result['headers'] = cors_headers + [('Content-Type', 'application/json')]
            result['body'] = [b'{"detail":"Internal server error"}']

    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run())
    finally:
        loop.close()
        asyncio.set_event_loop(None)

    start_response(result['status'], result['headers'])
    return result['body']
