import type { H3Event } from 'h3'

export const getIp = (event: H3Event) =>
  (event.node.req.headers['cf-connecting-ip']
    ?? event.node.req.headers['x-real-ip']
    ?? event.node.req.headers['x-forwarded-for']
    ?? event.node.req.socket?.remoteAddress) as string
