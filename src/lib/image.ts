/**
 * Compresses an image file and converts it to a base64 Data URL.
 *
 * The image is downscaled and re-encoded as JPEG, progressively reducing the
 * resolution and quality until the resulting base64 payload stays safely below
 * Vercel's 4.5 MB serverless request-body limit. This prevents the
 * `413 (Content Too Large)` error when the data URL is sent through the API proxy.
 */

const MAX_BASE64_LENGTH = 2_000_000; // ~2 MB — comfortably below Vercel's 4.5 MB cap
const DEFAULT_MAX_DIMENSION = 900;
const QUALITY_STEPS = [0.72, 0.58, 0.45, 0.35];
const DIMENSION_STEPS = [900, 720, 560, 420];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error('Não foi possível carregar a imagem. Verifique se o arquivo não está corrompido.'));
    img.src = dataUrl;
  });
}

function drawToCanvas(img: HTMLImageElement, maxDimension: number): HTMLCanvasElement {
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível processar a imagem no navegador.');
  }

  // JPEG has no alpha channel — fill with white to avoid a black background on transparent PNGs.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas;
}

export function compressImageToBase64(file: File, maxDimension = DEFAULT_MAX_DIMENSION): Promise<string> {
  return (async () => {
    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo selecionado não é uma imagem válida.');
    }

    const dataUrl = await readFileAsDataUrl(file);
    const img = await loadImage(dataUrl);

    for (const dimension of DIMENSION_STEPS.filter((d) => d <= maxDimension)) {
      const canvas = drawToCanvas(img, dimension);

      for (const quality of QUALITY_STEPS) {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        if (compressed.length <= MAX_BASE64_LENGTH) {
          return compressed;
        }
      }
    }

    throw new Error(
      'A imagem é muito grande para ser enviada. Tente uma imagem menor ou com menos detalhes.'
    );
  })();
}
