import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import asyncio
import io

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

    body = environ.get('wsgi.input', io.BytesIO()).read()
    result = {'status': '500 Error', 'headers': [], 'body': []}

    async def run():
        async def receive():
            return {'type': 'http.request', 'body': body, 'more_body': False}
        async def send(message):
            if message['type'] == 'http.response.start':
                phrases = {200:'OK',201:'Created',204:'No Content',400:'Bad Request',
                           401:'Unauthorized',403:'Forbidden',404:'Not Found',
                           405:'Method Not Allowed',422:'Unprocessable Entity',500:'Internal Server Error'}
                code = message['status']
                result['status'] = f"{code} {phrases.get(code,'Unknown')}"
                result['headers'] = [(k.decode(), v.decode()) for k, v in message.get('headers', [])]
            elif message['type'] == 'http.response.body':
                result['body'].append(message.get('body', b''))
        await app(scope, receive, send)

    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run())
    finally:
        loop.close()
        asyncio.set_event_loop(None)

    start_response(result['status'], result['headers'])
    return result['body']
