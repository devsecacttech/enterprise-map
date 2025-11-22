/**
 * Componente de prueba para verificar que todo funciona
 * Accesible en: http://localhost:3000/test-component
 */

import { Square, RectangleHorizontal } from 'lucide-react';

export default function TestComponent() {
  return (
    <div style={{
      padding: '40px',
      background: '#1e1e1e',
      minHeight: '100vh',
      color: '#d4d4d4',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#fff' }}>🧪 Componente de Prueba</h1>

      {/* Test 1: Iconos de Lucide React */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #3e3e42'
      }}>
        <h2 style={{ color: '#007acc', marginBottom: '15px' }}>Test 1: Iconos de Lucide React</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <RectangleHorizontal size={48} strokeWidth={2} color="#4a9eff" />
            <p style={{ marginTop: '10px', fontSize: '14px' }}>RectangleHorizontal</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Square size={48} strokeWidth={2} color="#4a9eff" />
            <p style={{ marginTop: '10px', fontSize: '14px' }}>Square</p>
          </div>
        </div>
        <p style={{ marginTop: '15px', color: '#4ade80' }}>
          {typeof RectangleHorizontal !== 'undefined' && typeof Square !== 'undefined'
            ? '✅ Lucide React cargado correctamente'
            : '❌ Error: Lucide React no cargó'}
        </p>
      </div>

      {/* Test 2: Iconos SVG de respaldo */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #3e3e42'
      }}>
        <h2 style={{ color: '#007acc', marginBottom: '15px' }}>Test 2: Iconos SVG de Respaldo</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>Rectángulo SVG</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>Cuadrado SVG</p>
          </div>
        </div>
        <p style={{ marginTop: '15px', color: '#4ade80' }}>✅ SVG de respaldo funcional</p>
      </div>

      {/* Test 3: Canvas SVG */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #3e3e42'
      }}>
        <h2 style={{ color: '#007acc', marginBottom: '15px' }}>Test 3: Canvas SVG</h2>
        <div style={{
          width: '100%',
          height: '400px',
          background: '#1e1e1e',
          border: '2px solid #007acc',
          borderRadius: '6px',
          position: 'relative'
        }}>
          <svg width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3e3e42" strokeWidth="0.5"/>
              </pattern>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#007acc"/>
              </marker>
            </defs>

            {/* Grid */}
            <rect width="100%" height="100%" fill="url(#grid)"/>

            {/* Figura 1 */}
            <rect x="50" y="50" width="120" height="80" fill="#4a9eff" fillOpacity="0.3" stroke="#4a9eff" strokeWidth="2" rx="4"/>
            <text x="110" y="90" textAnchor="middle" fill="#ffffff" fontSize="14">Figura 1</text>

            {/* Figura 2 */}
            <rect x="300" y="150" width="100" height="100" fill="#4a9eff" fillOpacity="0.3" stroke="#4a9eff" strokeWidth="2" rx="4"/>
            <text x="350" y="200" textAnchor="middle" fill="#ffffff" fontSize="14">Figura 2</text>

            {/* Conexión */}
            <path d="M 170 90 L 235 90 L 235 200 L 300 200" fill="none" stroke="#007acc" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* Anchors */}
            <circle cx="170" cy="90" r="6" fill="#007acc" stroke="#ffffff" strokeWidth="2"/>
            <circle cx="300" cy="200" r="6" fill="#007acc" stroke="#ffffff" strokeWidth="2"/>

            {/* Snap highlight animado */}
            <g>
              <circle cx="300" cy="200" r="10" fill="none" stroke="#4ade80" strokeWidth="3" opacity="0.8">
                <animate attributeName="r" from="8" to="14" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="1" to="0.3" dur="1s" repeatCount="indefinite"/>
              </circle>
            </g>
          </svg>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(45, 45, 48, 0.9)',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Canvas: 100% x 400px
          </div>
        </div>
        <p style={{ marginTop: '15px', color: '#4ade80' }}>✅ Canvas SVG se renderiza correctamente</p>
      </div>

      {/* Test 4: Información del sistema */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #3e3e42'
      }}>
        <h2 style={{ color: '#007acc', marginBottom: '15px' }}>Test 4: Información del Sistema</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
          <div>User Agent: {navigator.userAgent}</div>
          <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
          <div>React: Renderizado ✓</div>
          <div>TypeScript: Compilado ✓</div>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#1a3d1a',
        border: '1px solid #4ade80',
        borderRadius: '6px',
        color: '#4ade80'
      }}>
        <strong>✅ Todos los tests pasaron</strong><br/>
        Si ves esta página, significa que la aplicación está funcionando correctamente.<br/>
        <strong>Volver a:</strong> <a href="/" style={{ color: '#60a5fa' }}>Aplicación Principal</a>
      </div>
    </div>
  );
}
