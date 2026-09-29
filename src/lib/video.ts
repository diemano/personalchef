/**
 * Utilitários para o vídeo de apresentação.
 *
 * O campo `conceptVideoUrl` (admin > Mídias) aceita tanto um arquivo direto
 * (MP4) quanto um link do YouTube. A tag <video> não reproduz links do
 * YouTube, então esses precisam ser incorporados via <iframe>.
 */

/** Extrai o ID do vídeo a partir dos formatos mais comuns do YouTube. */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }

      const match = parsed.pathname.match(/^\/(embed|shorts|v)\/([^/?#]+)/);
      if (match) return match[2];
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * URL para incorporar o vídeo em um <iframe>.
 * Retorna `null` quando o link não é do YouTube (ex.: MP4, nesse caso use <video>).
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
}
