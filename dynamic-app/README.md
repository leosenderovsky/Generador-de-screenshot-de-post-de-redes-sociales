# Generador de Screenshot — Versión Dinámica

Copia mejorada del proyecto original con soporte para cargar posts directamente desde URLs de X (Twitter), Instagram y Facebook usando oEmbed.

## Características

✅ **Carga dinámica de posts** desde URLs públicas de X, Instagram y Facebook
✅ **Interfaz completa con TailwindCSS** — igual al proyecto original
✅ **Proxy seguro** — las claves de API no se exponen en el cliente
✅ **Todas las opciones visuales intactas** — personalización total del screenshot
✅ **Exportación en PNG/JPG** con resoluciones personalizables

## Setup Rápido

### 1. Dependencias

Desde la carpeta `dynamic-app`:

```bash
npm install
```

Se instalarán:
- `express`, `axios`, `cors`, `dotenv`, `cheerio` (servidor proxy)
- `react`, `react-dom`, `lucide-react`, `html2canvas` (frontend)
- `tailwindcss`, `autoprefixer`, `vite`, `@vitejs/plugin-react` (build & estilos)

### 2. Variables de Entorno

Copia `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y añade tu `FACEBOOK_ACCESS_TOKEN`:

```
FACEBOOK_ACCESS_TOKEN=tu_token_aqui
PORT=4001
```

**Cómo obtener el token:**
- Ve a [Meta for Developers](https://developers.facebook.com/)
- Crea una App y obtén un Access Token con permisos `instagram_basic`

### 3. Ejecutar en Desarrollo

Para iniciar **simultáneamente** el servidor proxy (puerto 4001) y Vite (puerto 3000):

```bash
npm run dev:all
```

O en **terminales separadas**:

**Terminal 1 — Servidor proxy:**
```bash
npm run start:server
```

**Terminal 2 — Frontend Vite:**
```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

## Uso

1. **Pega una URL** de un post público de X, Instagram o Facebook en el panel izquierdo.
2. **Presiona "Cargar post"** — el servidor proxy extrae los datos via oEmbed.
3. **El contenido se rellena automáticamente**: nombre, @usuario, texto, imagen, etc.
4. **Personaliza visualmente**: cambia colores, layout, tema (claro/oscuro), resolución.
5. **Descarga**: exporta como PNG o JPG con la resolución deseada.

## Estructura del Proyecto

```
dynamic-app/
├── src/
│   ├── components/
│   │   ├── ControlPanel.tsx     ← Panel de control (URL input + opciones)
│   │   ├── PreviewCanvas.tsx    ← Canvas de vista previa
│   │   ├── PostCard.tsx         ← Card del post (renderizado)
│   │   └── IconComponents.tsx   ← Logos de redes (SVG)
│   ├── App.tsx                  ← Componente raíz
│   ├── types.ts                 ← Tipos TypeScript
│   ├── constants.ts             ← Gradientes predefinidos
│   ├── main.tsx                 ← Entry point
│   └── styles.css               ← Tailwind directives
├── server/
│   └── index.js                 ← Proxy Express + oEmbed
├── index.html
├── vite.config.ts               ← Config Vite con proxy
├── tailwind.config.js           ← Tailwind CSS config
├── postcss.config.js            ← PostCSS + Autoprefixer
├── tsconfig.json
├── package.json
├── .env.local.example
└── README.md
```

## Flujo Técnico

1. **Usuario pega URL** →
2. **ControlPanel envía POST a `/api/fetch-post`** →
3. **Vite proxy redirige a `http://localhost:4001/fetch-post`** →
4. **Servidor Express detecta plataforma** (X / Instagram / Facebook) →
5. **Llama oEmbed endpoint** (con `FACEBOOK_ACCESS_TOKEN` si es necesario) →
6. **Parsea HTML con Cheerio** (extrae texto, imagen, autor) →
7. **Mapea a `PostData`** (preservando tipos) →
8. **Retorna JSON** → React actualiza estado →
9. **PreviewCanvas renderiza PostCard** con datos reales

## Limitaciones de oEmbed por Plataforma

### X (Twitter)
- ✅ **Extrae**: nombre de usuario, texto del post, fecha
- ❌ **No extrae**: imagen del post, likes, retweets, comentarios
- **Razón**: oEmbed de Twitter es muy básico y no proporciona métricas sin la API completa v2
- **Workaround**: Edita manualmente la imagen y conteos en el panel

### Instagram
- ✅ **Extrae**: nombre, username, texto, imagen de la foto
- ❌ **No extrae**: likes, comentarios, imagen de perfil de alta calidad
- **Requisito**: Token de Facebook Graph API válido con permisos `instagram_basic`
- **Nota**: Algunos posts pueden requerir permisos adicionales si no son públicos

### Facebook
- ✅ **Extrae**: nombre, username, texto, imagen del post
- ❌ **No extrae**: likes, comentarios, reacciones
- **Requisito**: Token de Facebook Graph API válido
- **Nota**: Similar a Instagram, depende de permisos de privacidad

---

## Notas Importantes

- **Los conteos (likes/retweets/comments)** son limitaciones de oEmbed; no se pueden obtener sin APIs pagadas o completas. Déjalos vacíos o edítalos manualmente.
- **Posts privados**: Si el post no es público, oEmbed fallará. El servidor mostrará un error amigable.
- **Rate limits**: Para producción, implementar cache y limitar requests por IP.
- **CORS**: El proxy Express maneja CORS automáticamente; el cliente nunca ve la URL base del servidor.
- **Puerto 4001 vs 3000**: Vite corre en 3000 (frontend), el servidor proxy en 4001. Asegúrate de que ambos están disponibles.

## Scripts Disponibles

```bash
npm run dev          # Inicia Vite (fronted, puerto 3000)
npm run start:server # Inicia servidor proxy (puerto 4001)
npm run dev:all      # Inicia ambos simultáneamente (recomendado)
npm run build        # Build de producción
npm run preview      # Preview del build
```

## Troubleshooting

### "FACEBOOK_ACCESS_TOKEN not set"

**Problema**: Aunque agregaste la variable en `.env.local`, el servidor dice que no está configurada.

**Soluciones**:
1. Verifica que `.env.local` exists en la raíz de `dynamic-app/`:
   ```bash
   ls -la .env.local  # En Linux/Mac
   dir .env.local     # En Windows PowerShell
   ```

2. Asegúrate que la variable está en MAYÚSCULAS:
   ```
   FACEBOOK_ACCESS_TOKEN=tu_token_aqui
   ```
   (No: `Facebook_Access_Token` o `facebook_access_token` — debe ser exactamente `FACEBOOK_ACCESS_TOKEN`)

3. Verifica que **`PORT=4001`** (no 3000):
   ```
   PORT=4001
   FACEBOOK_ACCESS_TOKEN=...
   ```

4. **Reinicia el servidor** después de editar `.env.local`:
   ```bash
   npm run dev:all
   ```

5. En la consola del servidor deberías ver:
   ```
   ✓ FACEBOOK_ACCESS_TOKEN loaded
   Proxy server listening on 4001
   ```

### X/Twitter: No carga imagen ni métricas

**Problema**: El texto y usuario se cargan pero falta la imagen del post y no hay likes/retweets.

**Explicación**: Esta es una **limitación de oEmbed de Twitter**. El endpoint public de oEmbed de Twitter NO proporciona:
- Imagen(es) del post
- Conteo de likes
- Conteo de retweets
- Conteo de comentarios

**Workarounds**:
1. **Editar manualmente**: En el panel izquierdo, sube la imagen del post usando el botón "Post Media" y edita los conteos.
2. **Usar la API v2 de Twitter**: Para obtener datos completos, necesitarías integrar la API oficial de Twitter con autenticación Bearer (requiere acceso de desarrollador elevado).
3. **Usar posts de Instagram/Facebook**: Estas plataformas devuelven imágenes via oEmbed.

### Instagram: Error al cargar posts

**Problema**: "Error fetching post" al intentar cargar un post de Instagram.

**Causas posibles**:
1. El token `FACEBOOK_ACCESS_TOKEN` es inválido o expiró
2. El token no tiene permisos `instagram_basic` o `instagram_graph_user_media`
3. El post no es público o pertenece a otra cuenta
4. El post fue borrado o el usuario privó su perfil

**Soluciones**:
1. Genera un nuevo token en [Meta for Developers](https://developers.facebook.com/)
2. Asegúrate de otorgar permisos: `instagram_basic`, `instagram_graph_user_media`
3. Prueba con un post público de una cuenta pública conocida

### "Connection refused on localhost:4001"

**Problema**: Error al conectar con el servidor proxy.

**Soluciones**:
1. Asegúrate de ejecutar `npm run dev:all` (inicia tanto Vite como el servidor)
2. Verifica que el puerto 4001 no está en uso:
   ```bash
   # Linux/Mac
   lsof -i :4001
   
   # Windows PowerShell
   netstat -ano | findstr :4001
   ```
3. Si el puerto está ocupado, cambia `PORT` en `.env.local` a otro puerto (ej: 4002)

### Imágenes bloqueadas por CORS

**Problema**: Las imágenes se cargan pero algunos proveedores bloquean CORS.

**Soluciones**:
1. Algunos proveedores no permiten acceso CORS a thumbnails — es una limitación de ellos
2. Prueba con otro post de la misma plataforma
3. Para producción, considera usar un servicio proxy de imágenes como Cloudinary o imgproxy

## Producción

Para desplegar:

1. Build del frontend: `npm run build`
2. Servir `dist/` con un servidor estático (Vercel, Netlify, AWS S3, etc.)
3. Desplegar servidor Express en otro host (Heroku, DigitalOcean, AWS Lambda, etc.)
4. Configurar variables de entorno en ambos hosts
5. Actualizar URL del proxy en el código (opcional si usas servidor separado)

## Licencia

Mismo que el proyecto original: Leo Aquiba Senderovsky

---

**Última actualización:** Febrero 2026

