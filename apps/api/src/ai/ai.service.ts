import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SettingsService } from '../settings/settings.service';

interface Category {
  id: number;
  nameEn: string;
  nameFr: string;
}

export interface GeneratedProduct {
  descriptionEn: string;
  descriptionFr: string;
  specifications: string;
  categoryId: number;
}

@Injectable()
export class AiService {
  constructor(private readonly settings: SettingsService) {}

  private async getApiKey(): Promise<string> {
    // DB setting takes priority — survives clones and code sharing
    const all = await this.settings.findAll();
    const dbKey = all['gemini_api_key'];
    if (dbKey && dbKey.trim()) return dbKey.trim();

    // Fallback to .env (local dev only, not committed to git)
    const envKey = process.env.GEMINI_API_KEY;
    if (envKey && envKey.trim()) return envKey.trim();

    throw new ServiceUnavailableException(
      'Gemini API key not configured. Go to Admin → Settings → AI Integration and enter your key.',
    );
  }

  async generateProduct(productName: string, categories: Category[]): Promise<GeneratedProduct> {
    const apiKey = await this.getApiKey();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const categoriesList = categories
      .map((c) => `  { "id": ${c.id}, "en": "${c.nameEn}", "fr": "${c.nameFr}" }`)
      .join('\n');

    const prompt = `You are a product catalog assistant for LTIC SARL, a B2B logistics and industrial supply company (generators, lubricants, filters, timber, marine chemicals, heavy equipment). Given a product name, generate catalog data.

Product name: "${productName}"

Available categories:
[
${categoriesList}
]

Return ONLY a JSON object (no markdown, no extra text) with exactly these keys:
- "descriptionEn": string — 1-2 sentence professional B2B description in English
- "descriptionFr": string — French translation of the description
- "specifications": string — technical specs as plain text, one per line (e.g. "Viscosity: 15W-40\\nVolume: 1L, 5L, 20L\\nStandard: API SN")
- "categoryId": number — the id of the most appropriate category from the list above

Example output:
{"descriptionEn":"...","descriptionFr":"...","specifications":"...","categoryId":3}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text) as GeneratedProduct;

      if (!parsed.descriptionEn || !parsed.categoryId) {
        throw new Error('Incomplete response from AI');
      }

      return parsed;
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        throw new BadRequestException('AI returned invalid JSON. Please try again.');
      }
      // Surface the real Gemini SDK error (e.g. invalid key, quota, model name)
      const detail = err?.message ?? err?.toString() ?? 'Unknown error';
      console.error('[AiService] Gemini error:', detail);
      throw new ServiceUnavailableException(`Gemini error: ${detail}`);
    }
  }
}
