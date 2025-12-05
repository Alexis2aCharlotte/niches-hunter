import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'NICHES HUNTER - Spot Profitable iOS Niches Before Anyone Else'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Radar circles */}
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '375px',
            height: '375px',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.25)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '125px',
            height: '125px',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            display: 'flex',
          }}
        />

        {/* Radar center dot */}
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#00FF88',
            boxShadow: '0 0 30px #00FF88, 0 0 60px #00FF88',
            display: 'flex',
          }}
        />

        {/* Radar sweep effect */}
        <div
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 136, 0.3) 30deg, transparent 60deg)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />

        {/* Blips */}
        <div
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#00FF88',
            boxShadow: '0 0 15px #00FF88',
            top: '180px',
            left: '380px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(0, 255, 136, 0.6)',
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
            top: '280px',
            right: '350px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(0, 255, 136, 0.4)',
            top: '400px',
            left: '500px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(0, 255, 136, 0.7)',
            boxShadow: '0 0 12px rgba(0, 255, 136, 0.6)',
            top: '220px',
            right: '400px',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            marginTop: '50px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                background: '#00FF88',
                boxShadow: '0 0 20px #00FF88',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#00FF88',
                letterSpacing: '0.2em',
                fontFamily: 'monospace',
              }}
            >
              NICHES HUNTER
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#FFFFFF' }}>Spot </span>
            <span
              style={{
                color: '#00FF88',
                textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
              }}
            >
              Profitable iOS Niches
            </span>
            <span style={{ color: '#FFFFFF' }}>Before Anyone Else</span>
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '24px',
              fontFamily: 'monospace',
            }}
          >
            2-3 analyzed niches in your inbox daily • 100% Free
          </p>
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00FF88',
              display: 'flex',
            }}
          />
          <span
            style={{
              color: '#00FF88',
              fontSize: '14px',
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          >
            2,100+ INDIE DEVS ALREADY HUNTING
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

