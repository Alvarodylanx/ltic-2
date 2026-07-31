import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  async generateProduct(productName: string, categories: Category[]): Promise<GeneratedProduct> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException('GEMINI_API_KEY is not configured. Add it to .env');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
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
      throw new ServiceUnavailableException(err.message || 'AI generation failed');
    }
  }
}
