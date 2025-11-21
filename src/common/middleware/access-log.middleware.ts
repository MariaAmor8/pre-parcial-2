/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

function redact(headers: Record<string, any>) {
  const copy = { ...headers };
  for (const key of ['authorization', 'cookie', 'x-api-key']) {
    if (copy[key]) copy[key] = '***redacted***';
  }
  return copy;
}

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  use(req: any, res: any, next: Function) {
    const start = Date.now();
    const id = uuid();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);

    const inMsg = {
      requestId: id,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip ?? req.connection.remoteAddress,
      ua: req.headers['user-agent'],
      headers: redact(req.headers),
    };
    console.log('Request In:', JSON.stringify(inMsg));

    res.on('finish', () => {
      const outMsg = {
        requestId: id,
        status: res.statusCode,
        durationMs: Date.now() - start,
        mrs: req.method,
        url: req.originalUrl,
      };
      console.log('Request Out:', JSON.stringify(outMsg));
    });
    next();
  }
}
