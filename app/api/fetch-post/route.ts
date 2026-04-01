// Esto es un archivo TypeScript (.ts = TypeScript, un JavaScript con tipos)

// Importamos las herramientas que necesitamos
import { NextRequest, NextResponse } from 'next/server';
import { parseFacebookHTML, parseInstagramHTML, parseXHTML } from '@/app/lib/parsers';

// Esta función se ejecuta cuando alguien hace una petición a /api/fetch-post
export async function POST(request: NextRequest) {
  try {
    // 1. Obtenemos el URL que el usuario envió
    const { url } = await request.json();
    
    // 2. Detectamos qué plataforma es (Instagram, Facebook o X)
    const platform = detectPlatform(url);
    
    // 3. Según la plataforma, pedimos los datos
    let postData;
    if (platform === 'instagram') {
      postData = await fetchInstagramPost(url);
    } else if (platform === 'facebook') {
      postData = await fetchFacebookPost(url);
    } else if (platform === 'x') {
      postData = await fetchXPost(url);
    }
    
    // 4. Devolvemos los datos al frontend
    return NextResponse.json({ success: true, data: postData });
    
  } catch (error) {
    // Si algo sale mal, devolvemos un error
    return NextResponse.json(
      { success: false, error: 'No se pudo obtener el post' },
      { status: 500 }
    );
  }
}

// Función para detectar la plataforma
function detectPlatform(url: string): 'instagram' | 'facebook' | 'x' | null {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'x';
  return null;
}

// Función para obtener datos de Instagram
async function fetchInstagramPost(url: string) {
  // Construimos la URL de la API de Instagram oEmbed
  const oembedUrl = `https://graph.facebook.com/v22.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`;
  
  // Hacemos la petición
  const response = await fetch(oembedUrl);
  const data = await response.json();
  
  // La respuesta viene con HTML, necesitamos parsearlo
  const parsed = parseInstagramHTML(data.html);
  
  return parsed;
}

// Similar para Facebook
async function fetchFacebookPost(url: string) {
  const oembedUrl = `https://graph.facebook.com/v22.0/oembed_post?url=${encodeURIComponent(url)}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`;
  
  const response = await fetch(oembedUrl);
  const data = await response.json();
  
  return parseFacebookHTML(data.html);
}

// Y para X (más simple porque no necesita token)
async function fetchXPost(url: string) {
  const oembedUrl = `https://publish.x.com/oembed?url=${encodeURIComponent(url)}`;
  
  const response = await fetch(oembedUrl);
  const data = await response.json();
  
  return parseXHTML(data.html);
}