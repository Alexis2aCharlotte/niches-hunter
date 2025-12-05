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
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0D1A0F 50%, #0A0A0A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Radar circles */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '225px',
            border: '2px solid rgba(0, 255, 136, 0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '175px',
            border: '2px solid rgba(0, 255, 136, 0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '125px',
            border: '2px solid rgba(0, 255, 136, 0.2)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '75px',
            border: '2px solid rgba(0, 255, 136, 0.25)',
            display: 'flex',
          }}
        />

        {/* Center glow */}
        <div
          style={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            background: '#00FF88',
            boxShadow: '0 0 40px 20px rgba(0, 255, 136, 0.4)',
            display: 'flex',
          }}
        />

        {/* Blips */}
        <div
          style={{
            position: 'absolute',
            width: '14px',
            height: '14px',
            borderRadius: '7px',
            background: '#00FF88',
            boxShadow: '0 0 20px 5px rgba(0, 255, 136, 0.5)',
            top: '150px',
            left: '400px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            background: '#00FF88',
            boxShadow: '0 0 15px 3px rgba(0, 255, 136, 0.4)',
            top: '200px',
            right: '380px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '5px',
            background: 'rgba(0, 255, 136, 0.7)',
            top: '420px',
            left: '480px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            background: '#00FF88',
            boxShadow: '0 0 15px 3px rgba(0, 255, 136, 0.4)',
            top: '380px',
            right: '420px',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                background: '#00FF88',
                boxShadow: '0 0 15px 5px rgba(0, 255, 136, 0.5)',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#00FF88',
                letterSpacing: '0.15em',
              }}
            >
              NICHES HUNTER
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              Spot
            </span>
            <span
              style={{
                fontSize: '52px',
                fontWeight: 700,
                color: '#00FF88',
                lineHeight: 1.1,
                textShadow: '0 0 40px rgba(0, 255, 136, 0.5)',
              }}
            >
              Profitable iOS Niches
            </span>
            <span
              style={{
                fontSize: '52px',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              Before Anyone Else
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '28px',
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
            gap: '10px',
            padding: '12px 24px',
            border: '1px solid rgba(0, 255, 136, 0.4)',
            background: 'rgba(0, 255, 136, 0.1)',
            borderRadius: '6px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '5px',
              background: '#00FF88',
              display: 'flex',
            }}
          />
          <span
            style={{
              color: '#00FF88',
              fontSize: '16px',
              letterSpacing: '0.05em',
              fontWeight: 600,
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
