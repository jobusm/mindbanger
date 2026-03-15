import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mindbanger Daily',
    short_name: 'Mindbanger',
    description: 'Daily mental clarity & focus signals.',
    start_url: '/app/today',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon?size=180',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
