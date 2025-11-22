#!/bin/bash

echo "======================================"
echo "  Verificación del Canvas Admin  "
echo "======================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

echo "✅ Directorio correcto"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js instalado: $NODE_VERSION"
echo ""

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm instalado: $NPM_VERSION"
echo ""

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules no existe"
    echo "   Ejecutando: npm install"
    npm install
else
    echo "✅ node_modules existe"
fi

echo ""

# Verificar lucide-react
if [ -d "node_modules/lucide-react" ]; then
    echo "✅ lucide-react instalado"
else
    echo "❌ lucide-react NO instalado"
    echo "   Ejecutando: npm install lucide-react"
    npm install lucide-react
fi

echo ""

# Verificar archivos clave
echo "Verificando archivos clave..."
FILES=(
    "src/main.tsx"
    "src/App.tsx"
    "src/components/AdminDashboard.tsx"
    "src/components/InfiniteCanvas.tsx"
    "src/components/LeftPanel.tsx"
    "src/hooks/useCanvasState.ts"
    "src/hooks/useTooltip.ts"
    "src/types.ts"
    "index.html"
    "vite.config.ts"
)

ALL_EXISTS=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (FALTA)"
        ALL_EXISTS=false
    fi
done

echo ""

if [ "$ALL_EXISTS" = false ]; then
    echo "❌ Faltan archivos necesarios"
    exit 1
fi

echo "✅ Todos los archivos necesarios existen"
echo ""

# Verificar TypeScript
echo "Verificando compilación TypeScript..."
npx tsc --noEmit 2>&1 | head -20

echo ""
echo "======================================"
echo "  Verificación Completada  "
echo "======================================"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Iniciar servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "2. Abrir en el navegador:"
echo "   http://localhost:3000"
echo ""
echo "3. Ver página de prueba:"
echo "   http://localhost:3000/test.html"
echo ""
echo "4. Si usas LocalTunnel:"
echo "   lt --port 3000"
echo ""
