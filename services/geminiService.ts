
import { GoogleGenAI, Type } from "@google/genai";
import { AppConfig, GeneratedCode, StoreMetadata } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateAndroidProject(config: AppConfig): Promise<GeneratedCode> {
    const prompt = `Generate a professional Android WebView project configuration.
    App Name: ${config.name}
    Package Name: ${config.packageName}
    URL: ${config.url}
    Primary Color: ${config.themeColor}
    Permissions needed: ${Object.entries(config.permissions).filter(([_, v]) => v).map(([k]) => k).join(', ')}

    Return the following files in a JSON format:
    1. MainActivity.java (Modern WebView implementation with ChromeClient, back button support, and permission handling)
    2. AndroidManifest.xml (Properly configured with Internet permission and declared activities)
    3. build.gradle (app level)
    4. strings.xml
    5. themes.xml

    Use best practices for Android development.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainActivity: { type: Type.STRING },
            manifest: { type: Type.STRING },
            buildGradle: { type: Type.STRING },
            stringsXml: { type: Type.STRING },
            stylesXml: { type: Type.STRING },
          },
          required: ["mainActivity", "manifest", "buildGradle", "stringsXml", "stylesXml"]
        }
      }
    });

    try {
      return JSON.parse(response.text.trim()) as GeneratedCode;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Invalid response format from AI");
    }
  }

  async generateAppIcon(config: AppConfig): Promise<string> {
    const prompt = `A professional, minimalist, high-quality modern flat vector app icon for an Android application. 
    App Name: ${config.name}
    Industry: ${config.category}
    Primary Color: ${config.themeColor}
    The icon should be centered, on a solid background, suitable for a Google Play Store listing. No text.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated");
  }

  async generateStoreMetadata(config: AppConfig): Promise<StoreMetadata> {
    const prompt = `Generate high-converting Google Play Store SEO metadata for an Android app.
    App Name: ${config.name}
    Website context: ${config.url}
    Category: ${config.category}

    Return JSON with:
    1. shortDescription (max 80 chars)
    2. fullDescription (max 4000 chars, use bullet points, feature highlights)
    3. tags (at least 5 relevant keywords)
    4. category (most relevant Play Store category)`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shortDescription: { type: Type.STRING },
            fullDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING }
          },
          required: ["shortDescription", "fullDescription", "tags", "category"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  }

  async generateFeatureGraphic(config: AppConfig): Promise<string> {
    const prompt = `A professional Google Play Store Feature Graphic. 1024x500 aspect.
    App Name: ${config.name}
    Style: Modern, tech, vibrant, marketing showcase.
    Theme Color: ${config.themeColor}
    Abstract background with phone silhouettes or relevant symbols for ${config.category}. No small text. High quality marketing art.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9" // Closest to 1024x500
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  }
}
