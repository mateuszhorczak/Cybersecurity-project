export default defineEventHandler((event) => {
  const start = Date.now()

  /*   console.log('[Request]', {
      method: event.node.req.method,
      url: event.node.req.url,
      headers: event.node.req.headers,
    }) */

  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    console.log('[Response]', {
      status: event.node.res.statusCode,
      time: `${duration}ms`,
    })
  })
})
