# 🚀 Guía Rápida - Admin Dashboard Canvas

Una guía visual y práctica para usar todas las características del canvas infinito.

## 📋 Tabla de Contenidos
1. [Primeros Pasos](#primeros-pasos)
2. [Crear Figuras](#crear-figuras)
3. [Conectar Figuras](#conectar-figuras)
4. [Editar y Organizar](#editar-y-organizar)
5. [Navegación](#navegación)
6. [Atajos de Teclado](#atajos-de-teclado)
7. [Tips y Trucos](#tips-y-trucos)

---

## 🎯 Primeros Pasos

### Iniciar la Aplicación
```bash
npm install
npm run dev
```
La aplicación se abrirá en `http://localhost:3000`

### Interfaz Principal
La pantalla se divide en 4 zonas:
- **Barra Superior**: Controles de undo/redo, export/import, grid
- **Panel Izquierdo**: Biblioteca de figuras (arrastrables)
- **Panel Derecho**: Propiedades de figuras seleccionadas
- **Canvas Central**: Área de trabajo infinita

---

## 📦 Crear Figuras

### Método 1: Drag & Drop
1. En el panel izquierdo, pasa el mouse sobre un icono
2. Espera **3 segundos** para ver el tooltip con información
3. **Arrastra** el icono hacia el canvas
4. **Suelta** donde quieras crear la figura

### Método 2: Clic y Crear
1. Haz clic en un icono del panel
2. La figura aparecerá en el centro del canvas

### Tipos de Figuras Disponibles
- 📐 **Rectángulo**: Forma horizontal (width > height)
- ⬜ **Cuadrado**: Forma cuadrada (width = height)

---

## 🔗 Conectar Figuras

### Crear una Conexión
1. **Crea dos figuras** en el canvas (ej: dos rectángulos)
2. Observa los **puntos de conexión** (anchors) en cada lado
3. **Haz clic** en un anchor de la primera figura
4. **Arrastra** hacia la segunda figura
5. Al **acercarte** a un anchor, verás un **highlight verde pulsante** ✨
6. **Suelta** para crear la conexión

### Características del Snap-to-Anchor
- ✅ Radio de detección: **20 píxeles**
- ✅ Feedback visual: **Verde brillante pulsante**
- ✅ No necesitas ser exacto, el sistema te ayuda
- ✅ La conexión se ajusta automáticamente al anchor más cercano

### Editar Conexiones
- **Doble clic** en una línea: Crea un punto de control
- **Arrastra** puntos de control: Ajusta la trayectoria
- **Arrastra extremos**: Reconecta a otros anchors
- **Delete** con conexión seleccionada: Elimina la conexión

---

## ✏️ Editar y Organizar

### Seleccionar Figuras
- **Clic simple**: Selecciona una figura
- **Shift + Clic**: Agrega/quita de la selección
- **Ctrl/Cmd + A**: Selecciona todas las figuras

### Mover Figuras
- **Arrastra** cualquier figura seleccionada
- Las **conexiones se actualizan automáticamente** 🔄
- Mantén **Espacio** para hacer pan del canvas en lugar de mover

### Editar Propiedades
1. Selecciona una figura
2. El **panel derecho** muestra las propiedades
3. Edita:
   - 📝 Nombre
   - 📏 Posición (X, Y)
   - 📐 Tamaño (Ancho, Alto)
   - 🎨 Color

### Alinear Múltiples Figuras
1. Selecciona **2 o más figuras** (Shift + Clic)
2. Aparece automáticamente el **Toolbar de Alineación**
3. Opciones disponibles:
   - ⬅️ Alinear izquierda
   - ➡️ Alinear derecha
   - ⬆️ Alinear arriba
   - ⬇️ Alinear abajo
   - ↔️ Centrar horizontal
   - ↕️ Centrar vertical
   - 📊 Distribuir horizontal (requiere 3+)
   - 📊 Distribuir vertical (requiere 3+)

---

## 🗺️ Navegación

### Pan (Desplazamiento)
- **Método 1**: Mantén **Espacio** + arrastra con el mouse
- **Método 2**: Arrastra el **fondo del canvas** (sin figuras)
- **Método 3**: Usa el **minimap** (esquina inferior derecha)

### Zoom
- **Ctrl/Cmd + Scroll**: Acerca o aleja
- **Pinch** en trackpad: Gesto de zoom
- **Rango**: 0.1x (muy alejado) hasta 5x (muy cerca)

### Minimap
- **Ubicación**: Esquina inferior derecha
- **Función**: Muestra todo el canvas en miniatura
- **Uso**:
  - Haz **clic** para saltar a una posición
  - **Arrastra** el viewport (rectángulo azul) para navegar
  - Se actualiza **en tiempo real** con tus cambios

### Grid y Snap
- **Toggle Grid**: Botón en barra superior
- **Toggle Snap**: Botón en barra superior
- **Tamaño de grid**: 20px por defecto
- **Snap-to-grid**: Las figuras se alinean a la cuadrícula

---

## ⌨️ Atajos de Teclado

### Edición
| Atajo | Acción |
|-------|--------|
| `Ctrl/Cmd + C` | Copiar figuras seleccionadas |
| `Ctrl/Cmd + V` | Pegar figuras |
| `Ctrl/Cmd + X` | Cortar figuras |
| `Ctrl/Cmd + A` | Seleccionar todo |
| `Delete` / `Backspace` | Eliminar selección |
| `Esc` | Deseleccionar todo |

### Historial
| Atajo | Acción |
|-------|--------|
| `Ctrl/Cmd + Z` | Deshacer (hasta 20 pasos) |
| `Ctrl/Cmd + Y` | Rehacer |

### Navegación
| Atajo | Acción |
|-------|--------|
| `Espacio` | Activar modo pan temporal |
| `Ctrl/Cmd + Scroll` | Zoom in/out |

---

## 💡 Tips y Trucos

### 🎯 Conexiones Precisas
- **No te preocupes por la precisión**: El sistema de snap-to-anchor te ayuda
- **Busca el verde**: Cuando veas el highlight verde, estás cerca de un anchor
- **Experimenta**: Puedes reconectar endpoints arrastrándolos

### 🎨 Organización Visual
1. Usa el **Grid** para alinear manualmente
2. Selecciona múltiples figuras y usa **Alineación automática**
3. Agrupa elementos relacionados visualmente con **Distribución**

### ⚡ Flujo de Trabajo Rápido
1. Crea varias figuras primero (drag & drop desde panel izquierdo)
2. Organízalas con **Alinear y Distribuir**
3. Conecta las figuras con el **snap-to-anchor**
4. Ajusta propiedades en el **panel derecho**
5. Guarda tu trabajo con **Export** (JSON)

### 🔄 Deshacer/Rehacer
- **20 niveles de historial**: No tengas miedo de experimentar
- Funciona con:
  - ✅ Crear/eliminar figuras
  - ✅ Mover figuras
  - ✅ Crear/eliminar conexiones
  - ✅ Editar propiedades
  - ✅ Copiar/pegar

### 📱 Responsive
- El layout se adapta a diferentes tamaños de pantalla
- Los paneles son plegables para más espacio
- El canvas siempre ocupa el espacio disponible

### 🎭 Tooltips Informativos
- Pasa el mouse sobre cualquier icono
- Espera **3 segundos** sin mover
- Verás:
  - 📛 Nombre del elemento
  - 📝 Descripción detallada
  - 💡 Sugerencia de uso

### 💾 Persistencia
- **Export** guarda TODO el estado en JSON:
  - Todas las figuras y sus propiedades
  - Todas las conexiones
  - Posición del viewport (pan/zoom)
  - Configuración del grid
- **Import** restaura el estado exacto
- **Use-case**: Guardar diferentes escenarios o compartir con el equipo

---

## 🐛 Problemas Comunes

### Los iconos no se ven
✅ **Solucionado en v1.2.0**: Usa lucide-react con sistema simplificado

### El canvas está cortado
✅ **Solucionado en v1.2.0**: Layout flex optimizado con altura completa

### No puedo conectar figuras
1. Asegúrate de hacer **clic en un anchor** (punto de conexión)
2. **Arrastra** hacia otro anchor
3. Busca el **highlight verde** que indica que estás cerca
4. **Suelta** para crear la conexión

### Las conexiones no se mueven con las figuras
✅ **Funcionalidad core**: Las conexiones se actualizan automáticamente
- Si hay un problema, verifica que ambos endpoints estén conectados a anchors

---

## 📚 Recursos Adicionales

- **README.md**: Documentación completa de características
- **CHANGELOG.md**: Historial de versiones y cambios
- **TUNNELING.md**: Guía para acceso remoto con LocalTunnel
- **Código fuente**: Altamente documentado y organizado

---

## 🎉 ¡Disfruta Creando!

Esta herramienta está diseñada para ser **intuitiva** y **potente**.

**Empieza simple** y descubre características avanzadas a tu ritmo.

¿Tienes feedback o encontraste un bug? ¡Abre un issue! 🚀
