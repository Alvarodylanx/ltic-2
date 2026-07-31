import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import Groq from 'groq-sdk';
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
    const all = await this.settings.findAll();
    const dbKey = all['groq_api_key'];
    if (dbKey && dbKey.trim()) return dbKey.trim();

    const envKey = process.env.GROQ_API_KEY;
    if (envKey && envKey.trim()) return envKey.trim();

    throw new ServiceUnavailableException(
      'Groq API key not configured. Go to Admin → Settings → AI Integration and enter your key.',
    );
  }

  async generateProduct(productName: string, categories: Category[]): Promise<GeneratedProduct> {
    const apiKey = await this.getApiKey();
    const groq = new Groq({ apiKey });

    const categoriesList = categories
      .map((c) => `{ "id": ${c.id}, "en": "${c.nameEn}", "fr": "${c.nameFr}" }`)
      .join(', ');

    const prompt = `You are a product catalog assistant for LTIC SARL, a B2B logistics and industrial supply company (generators, lubricants, filters, timber, marine chemicals, heavy equipment).

Product name: "${productName}"

Available categories: [${categoriesList}]

Return a JSON object with exactly these keys:
- "descriptionEn": 1-2 sentence professional B2B description in English
- "descriptionFr": French translation of the description
- "specifications": technical specs as plain text, one per line (e.g. "Viscosity: 15W-40\\nVolume: 1L, 5L, 20L")
- "categoryId": the id (number) of the most appropriate category from the list`;

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      });

      const text = completion.choices[0]?.message?.content?.trim() ?? '';
      const parsed = JSON.parse(text) as GeneratedProduct;

      if (!parsed.descriptionEn || !parsed.categoryId) {
        throw new Error('Incomplete response from AI');
      }

      return parsed;
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        throw new BadRequestException('AI returned invalid JSON. Please try again.');
      }
      const detail = err?.message ?? err?.toString() ?? 'Unknown error';
      console.error('[AiService] Groq error:', detail);
      throw new ServiceUnavailableException(`AI error: ${detail}`);
    }
  }
}
