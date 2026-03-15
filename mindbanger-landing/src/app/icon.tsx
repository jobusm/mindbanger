import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      id: 'small',
      size: { width: 192, height: 192 },
      alt: 'Mindbanger Icon',
      contentType: 'image/png',
    },
    {
      id: 'large',
      size: { width: 512, height: 512 },
      alt: 'Mindbanger Icon',
      contentType: 'image/png',
    },
  ];
}

export default function Icon({ id }: { id: string }) {
  const size = id === 'small' ? { width: 192, height: 192 } : { width: 512, height: 512 };
  const fontSize = id === 'small' ? 120 : 340;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: fontSize,
          background: '#0f172a', // slate-950
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24', // amber-400
          fontWeight: 'bold',
          borderRadius: '20%',
        }}
      >
        M
      </div>
    ),
    {
      ...size,
    }
  )
}
