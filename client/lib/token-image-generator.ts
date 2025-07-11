interface TokenImageOptions {
  name: string;
  symbol: string;
  description: string;
}

// Copyright-free image sources
const PIXABAY_API_KEY = "45158-08fb7a0f7b7308b6a12e01ab2"; // Free tier key
const UNSPLASH_ACCESS_KEY = "demo"; // Demo key for development

export async function generateTokenImage(
  options: TokenImageOptions,
): Promise<string> {
  try {
    // First, try to get a copyright-free stock image
    const stockImageUrl = await getStockImage(options);
    if (stockImageUrl) {
      return await processStockImage(stockImageUrl, options);
    }
  } catch (error) {
    console.log("Stock image failed, generating pixelated image:", error);
  }

  // Fallback to pixelated generated image
  return generatePixelatedImage(options);
}

async function getStockImage(
  options: TokenImageOptions,
): Promise<string | null> {
  const keywords = extractKeywords(options);

  // Try Pixabay first (better for copyright-free images)
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keywords)}&image_type=photo&category=all&min_width=200&min_height=200&per_page=20&safesearch=true`,
    );

    if (response.ok) {
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        // Pick a random image from results
        const randomIndex = Math.floor(
          Math.random() * Math.min(data.hits.length, 10),
        );
        return data.hits[randomIndex].webformatURL;
      }
    }
  } catch (error) {
    console.log("Pixabay API failed:", error);
  }

  return null;
}

function extractKeywords(options: TokenImageOptions): string {
  const description = options.description.toLowerCase();
  const name = options.name.toLowerCase();
  const combinedText = `${description} ${name}`;

  // Extract silly/funny keywords for image search
  const keywords = [];

  // Funny animal combinations
  if (combinedText.includes("dog") || combinedText.includes("puppy")) {
    keywords.push("funny dog", "dog meme", "silly puppy", "dog costume");
  }
  if (combinedText.includes("cat") || combinedText.includes("kitty")) {
    keywords.push("funny cat", "cat meme", "grumpy cat", "silly kitten");
  }
  if (combinedText.includes("sheep") || combinedText.includes("lamb")) {
    keywords.push("funny sheep", "fluffy sheep", "sheep meme", "silly lamb");
  }
  if (combinedText.includes("frog") || combinedText.includes("pepe")) {
    keywords.push("funny frog", "meme frog", "silly frog");
  }

  // Silly space/moon themes
  if (
    combinedText.includes("moon") ||
    combinedText.includes("space") ||
    combinedText.includes("rocket")
  ) {
    keywords.push("funny astronaut", "silly rocket", "space meme", "moon face");
  }

  // Ridiculous car/lambo themes
  if (
    combinedText.includes("lambo") ||
    combinedText.includes("car") ||
    combinedText.includes("speed")
  ) {
    keywords.push("funny car", "toy car", "silly vehicle", "meme car");
  }

  // Food memes
  if (
    combinedText.includes("pizza") ||
    combinedText.includes("burger") ||
    combinedText.includes("food")
  ) {
    keywords.push("funny food", "meme food", "silly snacks");
  }

  // Internet culture/meme keywords
  if (combinedText.includes("doge") || combinedText.includes("shib")) {
    keywords.push("doge meme", "funny shiba", "meme dog");
  }
  if (combinedText.includes("banana") || combinedText.includes("fruit")) {
    keywords.push("funny banana", "fruit meme", "silly fruit");
  }
  if (combinedText.includes("potato") || combinedText.includes("vegetable")) {
    keywords.push("funny potato", "silly vegetable", "meme potato");
  }

  // Silly crypto-related
  if (
    combinedText.includes("coin") ||
    combinedText.includes("token") ||
    combinedText.includes("crypto")
  ) {
    keywords.push(
      "funny money",
      "silly coins",
      "meme cryptocurrency",
      "cartoon money",
    );
  }

  // Generic silly themes
  if (combinedText.includes("ninja") || combinedText.includes("warrior")) {
    keywords.push("funny ninja", "silly warrior", "cartoon fighter");
  }
  if (combinedText.includes("robot") || combinedText.includes("ai")) {
    keywords.push("funny robot", "silly AI", "cartoon robot", "meme robot");
  }
  if (combinedText.includes("wizard") || combinedText.includes("magic")) {
    keywords.push("funny wizard", "silly magic", "cartoon wizard");
  }

  // Default to funny/silly content
  if (keywords.length === 0) {
    const sillyDefaults = [
      "funny cartoon",
      "silly meme",
      "cute cartoon",
      "funny face",
      "silly character",
      "meme template",
      "cartoon animal",
      "funny emoji",
      "silly expression",
      "cute funny",
      "cartoon comedy",
      "funny drawing",
    ];
    const randomSilly =
      sillyDefaults[Math.floor(Math.random() * sillyDefaults.length)];
    keywords.push(randomSilly, "cartoon", "funny");
  }

  // Always add meme/funny modifier to make it sillier
  const memeModifiers = ["funny", "silly", "meme", "cartoon", "cute"];
  const randomModifier =
    memeModifiers[Math.floor(Math.random() * memeModifiers.length)];
  keywords.unshift(randomModifier);

  return keywords.slice(0, 4).join(" ");
}

async function processStockImage(
  imageUrl: string,
  options: TokenImageOptions,
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas size
      canvas.width = 200;
      canvas.height = 200;

      // Draw and crop image to square
      const size = Math.min(img.width, img.height);
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;

      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 200, 200);

      // Add pixelated effect
      ctx.imageSmoothingEnabled = false;
      const imageData = ctx.getImageData(0, 0, 200, 200);
      pixelateImageData(imageData, 8); // 8x8 pixel blocks
      ctx.putImageData(imageData, 0, 0);

      // Add overlay elements
      addTokenOverlay(ctx, options);

      // Convert to blob URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve(generatePixelatedImage(options));
          }
        },
        "image/png",
        0.7,
      );
    };

    img.onerror = () => {
      resolve(generatePixelatedImage(options));
    };

    img.src = imageUrl;
  });
}

function generatePixelatedImage(options: TokenImageOptions): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    // Disable smoothing for pixelated effect
    ctx.imageSmoothingEnabled = false;

    // Generate colors based on token name/symbol
    const colors = generateColorsFromText(options.name + options.symbol);

    // Create pixelated background pattern
    createPixelatedBackground(ctx, colors);

    // Add pixelated elements
    addPixelatedElements(ctx, colors, options);

    // Add token symbol overlay
    addTokenOverlay(ctx, options);

    // Convert to blob URL
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve("");
        }
      },
      "image/png",
      0.5, // Lower quality for retro feel
    );
  });
}

function pixelateImageData(imageData: ImageData, blockSize: number) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      // Get average color of the block
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      let count = 0;

      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      a = Math.round(a / count);

      // Fill the entire block with the average color
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = a;
        }
      }
    }
  }
}

function createPixelatedBackground(ctx: CanvasRenderingContext2D, colors: any) {
  const blockSize = 16;

  for (let y = 0; y < 200; y += blockSize) {
    for (let x = 0; x < 200; x += blockSize) {
      // Random color selection for each block
      const colorOptions = [colors.primary, colors.secondary, colors.tertiary];
      const randomColor =
        colorOptions[Math.floor(Math.random() * colorOptions.length)];

      // Add some randomness to create texture
      if (Math.random() > 0.3) {
        ctx.fillStyle = randomColor;
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
  }
}

function addPixelatedElements(
  ctx: CanvasRenderingContext2D,
  colors: any,
  options: TokenImageOptions,
) {
  const blockSize = 8;

  // Add some pixelated shapes based on token theme
  const description = options.description.toLowerCase();

  // Draw pixelated rocket if space-themed
  if (description.includes("moon") || description.includes("rocket")) {
    drawPixelatedRocket(ctx, 150, 50, blockSize, colors.secondary);
  }

  // Draw pixelated car if car-themed
  if (description.includes("lambo") || description.includes("car")) {
    drawPixelatedCar(ctx, 50, 150, blockSize, colors.primary);
  }

  // Draw pixelated sheep if sheep-themed
  if (description.includes("sheep") || description.includes("lamb")) {
    drawPixelatedSheep(ctx, 150, 150, blockSize, colors.tertiary);
  }
}

function drawPixelatedRocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color;

  // Simple pixelated rocket pattern
  const pattern = [
    [0, 1, 0],
    [1, 1, 1],
    [1, 1, 1],
    [0, 1, 0],
    [1, 0, 1],
  ];

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        ctx.fillRect(x + col * size, y + row * size, size, size);
      }
    }
  }
}

function drawPixelatedCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color;

  // Simple pixelated car pattern
  const pattern = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
  ];

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        ctx.fillRect(x + col * size, y + row * size, size, size);
      }
    }
  }
}

function drawPixelatedSheep(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color;

  // Simple pixelated sheep pattern
  const pattern = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ];

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        ctx.fillRect(x + col * size, y + row * size, size, size);
      }
    }
  }
}

function addTokenOverlay(
  ctx: CanvasRenderingContext2D,
  options: TokenImageOptions,
) {
  // Add semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, 200, 200);

  // Add token symbol with retro pixel font effect
  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Add pixelated text shadow effect
  const symbol = options.symbol.substring(0, 6);

  // Shadow
  ctx.fillStyle = "#000000";
  ctx.fillText(symbol, 101, 101);

  // Main text
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(symbol, 100, 100);

  // Add corner meme emoji
  ctx.font = "16px Arial";
  const description = options.description.toLowerCase();

  if (description.includes("sheep")) ctx.fillText("🐑", 20, 20);
  else if (description.includes("moon")) ctx.fillText("🚀", 20, 20);
  else if (description.includes("lambo")) ctx.fillText("🏎️", 20, 20);
  else ctx.fillText("💎", 20, 20);
}

function generateColorsFromText(text: string): {
  primary: string;
  secondary: string;
  tertiary: string;
} {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 120) % 360;
  const hue3 = (hue1 + 240) % 360;

  // More saturated colors for retro/pixel art feel
  return {
    primary: `hsl(${hue1}, 90%, 60%)`,
    secondary: `hsl(${hue2}, 85%, 55%)`,
    tertiary: `hsl(${hue3}, 80%, 65%)`,
  };
}

export function cleanupImageUrl(url: string) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
