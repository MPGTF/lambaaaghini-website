export interface AITokenSuggestion {
  name: string;
  symbol: string;
  description: string;
  category: string;
  suggestedTags: string[];
  marketingHooks: string[];
  riskLevel: "low" | "medium" | "high";
  viralPotential: number; // 1-10 scale
}

export interface AIPromptAnalysis {
  sentiment: "positive" | "neutral" | "negative";
  themes: string[];
  keywords: string[];
  suggestedCategories: string[];
  targetAudience: string;
}

export class AITokenGenerator {
  private readonly patterns = {
    animals: {
      keywords: [
        "dog",
        "cat",
        "bear",
        "lion",
        "tiger",
        "wolf",
        "fox",
        "rabbit",
        "penguin",
        "monkey",
      ],
      prefixes: [
        "Super",
        "Mega",
        "Ultra",
        "Cyber",
        "Space",
        "Rocket",
        "Moon",
        "Diamond",
      ],
      suffixes: [
        "Coin",
        "Token",
        "Finance",
        "Protocol",
        "Network",
        "DAO",
        "DeFi",
      ],
    },
    tech: {
      keywords: [
        "ai",
        "robot",
        "cyber",
        "quantum",
        "neural",
        "blockchain",
        "crypto",
        "digital",
      ],
      prefixes: [
        "Neo",
        "Quantum",
        "Cyber",
        "Neural",
        "Smart",
        "Meta",
        "Proto",
        "Ultra",
      ],
      suffixes: [
        "AI",
        "Protocol",
        "Network",
        "Chain",
        "Tech",
        "Labs",
        "Systems",
      ],
    },
    finance: {
      keywords: [
        "money",
        "bank",
        "yield",
        "profit",
        "gold",
        "diamond",
        "treasure",
        "wealth",
      ],
      prefixes: [
        "Golden",
        "Diamond",
        "Platinum",
        "Elite",
        "Premium",
        "Royal",
        "Luxury",
      ],
      suffixes: [
        "Finance",
        "Capital",
        "Yield",
        "Vault",
        "Treasury",
        "Reserve",
        "Fund",
      ],
    },
    meme: {
      keywords: [
        "moon",
        "rocket",
        "diamond",
        "hands",
        "ape",
        "chad",
        "based",
        "pump",
      ],
      prefixes: [
        "Moon",
        "Rocket",
        "Diamond",
        "Chad",
        "Based",
        "Epic",
        "Legendary",
      ],
      suffixes: ["Moon", "Rocket", "Inu", "Pepe", "Chad", "Token", "Coin"],
    },
    luxury: {
      keywords: [
        "lamborghini",
        "ferrari",
        "rolex",
        "luxury",
        "premium",
        "elite",
        "exclusive",
      ],
      prefixes: [
        "Luxury",
        "Premium",
        "Elite",
        "Royal",
        "Platinum",
        "Diamond",
        "Exclusive",
      ],
      suffixes: [
        "Motors",
        "Collection",
        "Club",
        "Society",
        "Elite",
        "Premium",
        "Luxury",
      ],
    },
  };

  analyzePrompt(prompt: string): AIPromptAnalysis {
    const lowercasePrompt = prompt.toLowerCase();
    const words = lowercasePrompt.split(/\s+/);

    // Detect themes
    const themes: string[] = [];
    const keywords: string[] = [];

    for (const [category, data] of Object.entries(this.patterns)) {
      const matches = data.keywords.filter((keyword) =>
        lowercasePrompt.includes(keyword),
      );
      if (matches.length > 0) {
        themes.push(category);
        keywords.push(...matches);
      }
    }

    // Analyze sentiment
    const positiveWords = [
      "amazing",
      "awesome",
      "great",
      "best",
      "incredible",
      "fantastic",
      "moon",
      "rocket",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "crash",
      "dump",
      "scam",
    ];

    const positiveCount = positiveWords.filter((word) =>
      lowercasePrompt.includes(word),
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowercasePrompt.includes(word),
    ).length;

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (positiveCount > negativeCount) sentiment = "positive";
    if (negativeCount > positiveCount) sentiment = "negative";

    // Determine target audience
    let targetAudience = "General crypto enthusiasts";
    if (themes.includes("meme"))
      targetAudience = "Meme coin traders and social media users";
    if (themes.includes("tech"))
      targetAudience = "Tech-savvy investors and DeFi users";
    if (themes.includes("luxury"))
      targetAudience = "High-net-worth individuals and luxury enthusiasts";
    if (themes.includes("animals"))
      targetAudience = "Pet lovers and meme coin community";

    return {
      sentiment,
      themes,
      keywords: [...new Set(keywords)],
      suggestedCategories: themes,
      targetAudience,
    };
  }

  generateTokenSuggestions(
    prompt: string,
    count: number = 3,
  ): AITokenSuggestion[] {
    const analysis = this.analyzePrompt(prompt);
    const suggestions: AITokenSuggestion[] = [];

    for (let i = 0; i < count; i++) {
      const suggestion = this.createTokenSuggestion(prompt, analysis, i);
      suggestions.push(suggestion);
    }

    return suggestions;
  }

  private createTokenSuggestion(
    prompt: string,
    analysis: AIPromptAnalysis,
    variant: number,
  ): AITokenSuggestion {
    const primaryTheme = analysis.themes[0] || "tech";
    const pattern =
      this.patterns[primaryTheme as keyof typeof this.patterns] ||
      this.patterns.tech;

    // Generate name variations
    let name = "";
    let symbol = "";

    if (variant === 0) {
      // Direct approach - use keywords from prompt
      if (analysis.keywords.length > 0) {
        const keyword = analysis.keywords[0];
        const prefix =
          pattern.prefixes[Math.floor(Math.random() * pattern.prefixes.length)];
        name = `${prefix} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
        symbol = (prefix.slice(0, 2) + keyword.slice(0, 3)).toUpperCase();
      } else {
        name = this.generateGenericName(pattern);
        symbol = this.generateSymbol(name);
      }
    } else if (variant === 1) {
      // Creative combination approach
      const prefix =
        pattern.prefixes[Math.floor(Math.random() * pattern.prefixes.length)];
      const suffix =
        pattern.suffixes[Math.floor(Math.random() * pattern.suffixes.length)];
      name = `${prefix}${suffix}`;
      symbol = (prefix.slice(0, 3) + suffix.slice(0, 2)).toUpperCase();
    } else {
      // Themed approach
      name = this.generateThemedName(prompt, primaryTheme);
      symbol = this.generateSymbol(name);
    }

    // Generate description
    const description = this.generateDescription(prompt, name, analysis);

    // Calculate viral potential and risk
    const viralPotential = this.calculateViralPotential(analysis);
    const riskLevel = this.assessRiskLevel(analysis);

    // Generate marketing hooks
    const marketingHooks = this.generateMarketingHooks(analysis, name);

    return {
      name,
      symbol: symbol.slice(0, 8), // Ensure symbol isn't too long
      description,
      category: primaryTheme,
      suggestedTags: this.generateTags(analysis),
      marketingHooks,
      riskLevel,
      viralPotential,
    };
  }

  private generateGenericName(pattern: any): string {
    const prefix =
      pattern.prefixes[Math.floor(Math.random() * pattern.prefixes.length)];
    const suffix =
      pattern.suffixes[Math.floor(Math.random() * pattern.suffixes.length)];
    return `${prefix} ${suffix}`;
  }

  private generateThemedName(prompt: string, theme: string): string {
    const themeNames = {
      animals: [
        "Beast Protocol",
        "Wild Finance",
        "Predator Coin",
        "Pack Token",
      ],
      tech: [
        "Neural Network",
        "Quantum Finance",
        "Cyber Protocol",
        "Digital Asset",
      ],
      finance: [
        "Wealth Protocol",
        "Capital Network",
        "Treasury Token",
        "Elite Finance",
      ],
      meme: ["Moon Mission", "Rocket Fuel", "Diamond Protocol", "Chad Finance"],
      luxury: [
        "Premium Protocol",
        "Elite Network",
        "Luxury Finance",
        "Platinum Token",
      ],
    };

    const names =
      themeNames[theme as keyof typeof themeNames] || themeNames.tech;
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateSymbol(name: string): string {
    // Extract meaningful parts of the name for symbol
    const words = name.split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, 6).toUpperCase();
    } else if (words.length === 2) {
      return (words[0].slice(0, 3) + words[1].slice(0, 3)).toUpperCase();
    } else {
      return words
        .slice(0, 3)
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase();
    }
  }

  private generateDescription(
    prompt: string,
    name: string,
    analysis: AIPromptAnalysis,
  ): string {
    const templates = [
      `${name} brings ${prompt.toLowerCase()} to the Solana blockchain with innovative DeFi mechanics and community-driven growth.`,
      `Experience the future of ${analysis.themes.join(" and ")} with ${name}. Built for ${analysis.targetAudience.toLowerCase()}.`,
      `${name} revolutionizes the ${analysis.themes[0] || "crypto"} space with cutting-edge tokenomics and viral community features.`,
      `Join the ${name} movement - where ${prompt.toLowerCase()} meets decentralized finance on Solana's lightning-fast network.`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private calculateViralPotential(analysis: AIPromptAnalysis): number {
    let score = 5; // Base score

    // Boost for meme-related content
    if (analysis.themes.includes("meme")) score += 3;
    if (analysis.themes.includes("animals")) score += 2;

    // Boost for positive sentiment
    if (analysis.sentiment === "positive") score += 2;

    // Boost for viral keywords
    const viralKeywords = ["moon", "rocket", "diamond", "ape", "chad"];
    const viralMatches = analysis.keywords.filter((k) =>
      viralKeywords.includes(k),
    ).length;
    score += viralMatches;

    return Math.min(10, Math.max(1, score));
  }

  private assessRiskLevel(
    analysis: AIPromptAnalysis,
  ): "low" | "medium" | "high" {
    if (
      analysis.themes.includes("meme") ||
      this.calculateViralPotential(analysis) > 7
    ) {
      return "high"; // High viral potential often means high volatility
    }
    if (
      analysis.themes.includes("tech") ||
      analysis.themes.includes("finance")
    ) {
      return "low"; // More "serious" themes suggest stability
    }
    return "medium";
  }

  private generateMarketingHooks(
    analysis: AIPromptAnalysis,
    name: string,
  ): string[] {
    const hooks = [
      `🚀 ${name} is launching to the moon!`,
      `💎 Diamond hands only for ${name}`,
      `⚡ Lightning-fast gains with ${name} on Solana`,
      `🏆 Join the elite ${name} community`,
      `🔥 ${name} is the next 1000x gem`,
    ];

    // Theme-specific hooks
    if (analysis.themes.includes("luxury")) {
      hooks.push(`💎 Experience luxury DeFi with ${name}`);
      hooks.push(`👑 For the sophisticated investor - ${name}`);
    }

    if (analysis.themes.includes("animals")) {
      hooks.push(`🐕 The pack is growing - join ${name}!`);
      hooks.push(`🦁 Unleash the beast with ${name}`);
    }

    return hooks.slice(0, 3); // Return top 3 hooks
  }

  private generateTags(analysis: AIPromptAnalysis): string[] {
    const baseTags = ["Solana", "DeFi", "Community"];
    const themeTags = {
      meme: ["Meme", "Viral", "Community", "Fun"],
      animals: ["Pet", "Animal", "Cute", "Community"],
      tech: ["Technology", "Innovation", "Future", "AI"],
      finance: ["Finance", "Yield", "Investment", "Premium"],
      luxury: ["Luxury", "Premium", "Elite", "Exclusive"],
    };

    let tags = [...baseTags];
    for (const theme of analysis.themes) {
      const themeSpecificTags =
        themeTags[theme as keyof typeof themeTags] || [];
      tags.push(...themeSpecificTags);
    }

    return [...new Set(tags)].slice(0, 6);
  }
}

// Export singleton instance
export const aiGenerator = new AITokenGenerator();

// Utility functions
export function getTokenPreview(prompt: string): AITokenSuggestion {
  return aiGenerator.generateTokenSuggestions(prompt, 1)[0];
}

export function validatePrompt(prompt: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!prompt || prompt.trim().length === 0) {
    errors.push("Please provide a description for your token");
  }

  if (prompt && prompt.length < 10) {
    errors.push("Description should be at least 10 characters long");
  }

  if (prompt && prompt.length > 500) {
    errors.push("Description should be 500 characters or less");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
