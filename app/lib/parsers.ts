import * as cheerio from 'cheerio';

// Tipo de dato que queremos devolver (siempre el mismo para todas las plataformas)
export interface ParsedPost {
  platform: 'instagram' | 'facebook' | 'x';
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: {
    text: string;
    images: string[];
  };
  timestamp?: string;
}

export function parseInstagramHTML(html: string): ParsedPost {
  // Cargamos el HTML en cheerio (como si fuera una página web)
  const $ = cheerio.load(html);
  
  // Buscamos elementos específicos (esto varía según cómo Instagram estructura su HTML)
  // Nota: estos selectores pueden cambiar, tendrás que inspeccionarlos
  
  const text = $('.caption').text() || $('blockquote p').text();
  const username = $('a.author').text() || 'Usuario de Instagram';
  
  // Buscamos todas las imágenes
  const images: string[] = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) images.push(src);
  });
  
  return {
    platform: 'instagram',
    author: {
      name: username,
      username: username,
    },
    content: {
      text: text,
      images: images,
    },
  };
}

// Similar para Facebook y X...
export function parseFacebookHTML(html: string): ParsedPost {
  const $ = cheerio.load(html);

  const text = $('blockquote p').text() || $('meta[property="og:description"]').attr('content') || '';
  const authorName = $('a[title]').first().text() || $('meta[property="og:title"]').attr('content') || 'Usuario de Facebook';
  const username = authorName;

  const images: string[] = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) images.push(src);
  });

  return {
    platform: 'facebook',
    author: {
      name: authorName,
      username,
    },
    content: {
      text,
      images,
    },
  };
}

export function parseXHTML(html: string): ParsedPost {
  const $ = cheerio.load(html);
  const text = $('blockquote p').text() || $('meta[property="og:description"]').attr('content') || '';
  const authorName = $('a[rel="author"]').first().text() || $('meta[property="og:title"]').attr('content') || 'Usuario de X';
  const username = authorName;

  const images: string[] = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) images.push(src);
  });

  return {
    platform: 'x',
    author: {
      name: authorName,
      username,
    },
    content: {
      text,
      images,
    },
  };
}