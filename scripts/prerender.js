import fs from 'node:fs'
import path from 'node:path'

/**
 * Pre-render script for Garut Journey on Vercel and static hosting.
 * Executes TanStack Start server bundle to generate static HTML files in both
 * dist/client and dist/ root to guarantee 0% 404 NOT_FOUND errors on Vercel.
 */
async function prerender() {
  console.log('🚀 Starting Garut Journey static page generator for Vercel...')

  const serverPath = path.resolve('dist/server/server.js')
  const clientDir = path.resolve('dist/client')
  const distDir = path.resolve('dist')
  const publicDir = path.resolve('public')

  if (!fs.existsSync(serverPath)) {
    console.error('❌ Error: dist/server/server.js not found. Run vite build first.')
    process.exit(1)
  }

  const { default: server } = await import(serverPath)

  const routes = [
    '/',
    '/wp-admin',
    '/login',
    '/admin',
    '/destinations/mount-papandayan',
    '/destinations/situ-bagendit',
    '/destinations/cipanas-garut',
    '/destinations/garut-city-square',
    '/destinations/candi-cangkuang',
    '/destinations/kampung-sampireun',
    '/destinations/darajat-pass',
    '/destinations/santolo-beach',
    '/destinations/rancabuaya-beach',
    '/guide/panduan-website-garut-journey',
    '/guide/menelusuri-keindahan-alam-garut',
    '/guide/surga-kuliner-otentik-garut',
    '/guide/perfect-1-day-garut-itinerary',
    '/kwitansi/GJ-2610-8451',
  ]

  let successCount = 0

  for (const route of routes) {
    try {
      const req = new Request(`http://localhost:3000${route}`)
      const res = await server.fetch(req)

      if (res.status === 200) {
        const html = await res.text()

        if (route === '/') {
          // Write to dist/client/index.html & 404.html
          fs.writeFileSync(path.join(clientDir, 'index.html'), html, 'utf-8')
          fs.writeFileSync(path.join(clientDir, '404.html'), html, 'utf-8')

          // Also write directly to dist/index.html & dist/404.html
          fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8')
          fs.writeFileSync(path.join(distDir, '404.html'), html, 'utf-8')
        } else {
          const routeClean = route.replace(/^\//, '')

          // in dist/client/
          const targetDirClient = path.join(clientDir, routeClean)
          fs.mkdirSync(targetDirClient, { recursive: true })
          fs.writeFileSync(path.join(targetDirClient, 'index.html'), html, 'utf-8')

          // in dist/
          const targetDirDist = path.join(distDir, routeClean)
          fs.mkdirSync(targetDirDist, { recursive: true })
          fs.writeFileSync(path.join(targetDirDist, 'index.html'), html, 'utf-8')
        }
        successCount++
      } else {
        console.warn(`⚠️ Warning: Route ${route} returned status ${res.status}`)
      }
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to render route ${route}:`, err.message)
    }
  }

  // Also copy client assets to dist/assets if not present
  const clientAssetsDir = path.join(clientDir, 'assets')
  const distAssetsDir = path.join(distDir, 'assets')
  if (fs.existsSync(clientAssetsDir) && !fs.existsSync(distAssetsDir)) {
    fs.cpSync(clientAssetsDir, distAssetsDir, { recursive: true })
  }

  // Copy img folder to dist/img if not present
  const clientImgDir = path.join(clientDir, 'img')
  const distImgDir = path.join(distDir, 'img')
  if (fs.existsSync(clientImgDir) && !fs.existsSync(distImgDir)) {
    fs.cpSync(clientImgDir, distImgDir, { recursive: true })
  }

  // Ensure index.html exists
  const indexPath = path.join(clientDir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Fatal: index.html could not be generated.')
    process.exit(1)
  }

  console.log(`✅ Pre-render complete! ${successCount} routes generated across dist/client and dist/. Ready for Vercel deployment!`)
}

prerender().catch((err) => {
  console.error('❌ Prerender script failed:', err)
  process.exit(1)
})
