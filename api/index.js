import server from '../dist/server/server.js'

export const config = {
  // Support Node.js serverless runtime on Vercel
  runtime: 'nodejs',
  maxDuration: 15,
}

/**
 * Vercel Serverless Function entry point for Garut Journey (TanStack Start + Vite).
 * Automatically supports both Web Standard Request/Response and Node (req, res).
 */
export default async function handler(req, res) {
  // 1. Web Standard Request signature (Modern Vercel / Edge / Web Fetch API)
  if (typeof Request !== 'undefined' && req instanceof Request) {
    return server.fetch(req)
  }

  // 2. Node.js (req, res) signature
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost'
    const fullUrl = `${protocol}://${host}${req.url}`

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v))
        } else {
          headers.set(key, value)
        }
      }
    }

    const isGetOrHead = ['GET', 'HEAD'].includes(req.method?.toUpperCase() || '')
    const body = isGetOrHead ? null : req

    const webRequest = new Request(fullUrl, {
      method: req.method || 'GET',
      headers,
      body,
      // @ts-ignore
      duplex: 'half',
    })

    const webResponse = await server.fetch(webRequest)

    res.statusCode = webResponse.status
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val)
    })

    const arrayBuffer = await webResponse.arrayBuffer()
    res.end(Buffer.from(arrayBuffer))
  } catch (err) {
    console.error('Garut Journey server execution error:', err)
    if (res && typeof res.status === 'function') {
      res.status(500).send('Internal Server Error')
    } else if (res && typeof res.end === 'function') {
      res.statusCode = 500
      res.end('Internal Server Error')
    } else {
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
