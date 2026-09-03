/**
 * Compresses an image file and converts it to a base64 Data URL.
 *
 * The image is downscaled and re-encoded as JPEG, progressively reducing the
 * resolution and quality until the resulting base64 payload stays safely below
 * the ChefDesk API's ~100 KB request-body limit (it returns `413 Content Too
 * Large` above that). The data URL is sent inside the JSON body through the
 * `/api/chefdesk` proxy, so it must stay small.
 */

// The backend rejects request bodies at ~100 KB (Express default `express.json()`
// limit). Keep the base64 image well under that so the rest of the JSON still fits.
const MAX_BASE64_LENGTH = 80_000;
const DEFAULT_MAX_DIMENSION = 600;
const QUALITY_STEPS = [0.6, 0.5, 0.4, 0.3];
const DIMENSION_STEPS = [600, 480, 400, 320];

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
