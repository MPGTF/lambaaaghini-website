interface TokenImageOptions {
  name: string;
  symbol: string;
  description: string;
}

export function generateTokenImage(
  options: TokenImageOptions,
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Set canvas size (low quality on purpose)
    canvas.width = 200;
    canvas.height = 200;

    // Generate colors based on token name/symbol
    const colors = generateColorsFromText(options.name + options.symbol);

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.tertiary);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);

    // Add some meme-style shapes
    addRandomShapes(ctx, colors);

    // Add token symbol in the center
    addTokenSymbol(ctx, options.symbol);

    // Add some meme elements
    addMemeElements(ctx, options);

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
      0.3,
    ); // Low quality
  });
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

  return {
    primary: `hsl(${hue1}, 70%, 60%)`,
    secondary: `hsl(${hue2}, 80%, 50%)`,
    tertiary: `hsl(${hue3}, 60%, 70%)`,
  };
}

function addRandomShapes(ctx: CanvasRenderingContext2D, colors: any) {
  // Add some random circles and rectangles for meme effect
  const shapes = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < shapes; i++) {
    ctx.globalAlpha = 0.3;

    if (Math.random() > 0.5) {
      // Circle
      ctx.fillStyle = Math.random() > 0.5 ? colors.primary : colors.secondary;
      ctx.beginPath();
      ctx.arc(
        Math.random() * 200,
        Math.random() * 200,
        Math.random() * 40 + 10,
        0,
        2 * Math.PI,
      );
      ctx.fill();
    } else {
      // Rectangle
      ctx.fillStyle = Math.random() > 0.5 ? colors.secondary : colors.tertiary;
      ctx.fillRect(
        Math.random() * 150,
        Math.random() * 150,
        Math.random() * 60 + 20,
        Math.random() * 60 + 20,
      );
    }
  }

  ctx.globalAlpha = 1;
}

function addTokenSymbol(ctx: CanvasRenderingContext2D, symbol: string) {
  // Add token symbol with meme-style font
  ctx.font = "bold 32px Impact, Arial Black, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Add text shadow effect
  ctx.strokeText(symbol.substring(0, 6), 100, 100);
  ctx.fillText(symbol.substring(0, 6), 100, 100);
}

function addMemeElements(
  ctx: CanvasRenderingContext2D,
  options: TokenImageOptions,
) {
  // Add meme elements based on token description
  const description = options.description.toLowerCase();

  // Add sheep emoji if it's sheep-related
  if (description.includes("sheep") || description.includes("lamb")) {
    ctx.font = "24px Arial";
    ctx.fillText("🐑", 30, 30);
  }

  // Add rocket if moon-related
  if (description.includes("moon") || description.includes("rocket")) {
    ctx.font = "24px Arial";
    ctx.fillText("🚀", 170, 30);
  }

  // Add lambo if car-related
  if (description.includes("lambo") || description.includes("car")) {
    ctx.font = "24px Arial";
    ctx.fillText("🏎️", 30, 170);
  }

  // Add diamond hands
  if (description.includes("diamond") || description.includes("hodl")) {
    ctx.font = "24px Arial";
    ctx.fillText("💎", 170, 170);
  }

  // Add some random meme elements
  const memeEmojis = ["💨", "⚡", "🔥", "💰", "🌙", "🔮"];
  const randomEmoji = memeEmojis[Math.floor(Math.random() * memeEmojis.length)];
  ctx.font = "20px Arial";
  ctx.fillText(randomEmoji, Math.random() * 160 + 20, Math.random() * 160 + 20);
}

export function cleanupImageUrl(url: string) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
