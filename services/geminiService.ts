
import { GoogleGenAI, Type } from "@google/genai";

const productDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'نام محصول استخراج شده.',
    },
    description: {
      type: Type.STRING,
      description: 'توضیح کوتاه محصول استخراج شده.',
    },
  },
  required: ['name', 'description'],
};

const suggestionsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
        },
        required: ['name', 'description']
    }
};

export const generateGiftSuggestions = async (userBio: string, interests: string[] = []): Promise<{name: string, description: string}[]> => {
    try {
        // Fixed: Use initialization variable name 'ai' as per guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `شما یک مشاور هدیه حرفه‌ای هستید. بر اساس اطلاعات زیر، ۵ ایده خلاقانه برای هدیه دادن به این شخص پیشنهاد دهید.
        بیوگرافی: ${userBio}
        علایق: ${interests.join('، ')}
        فقط یک آرایه JSON شامل اشیاء با کلیدهای name و description برگردانید.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionsSchema,
            },
        });

        // Fixed: Use .text property instead of .text()
        const jsonText = response.text?.trim();
        return jsonText ? JSON.parse(jsonText) : [];
    } catch (error) {
        console.error("AI Suggestions Error:", error);
        return [];
    }
};

export const fetchProductDetails = async (url: string): Promise<{ name: string; description: string; }> => {
  try {
    // Fixed: Use initialization variable name 'ai' as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `شما یک دستیار هوشمند هستید که اطلاعات محصول را از یک URL استخراج می‌کنید. لطفاً نام و توضیحات کوتاه محصول را از این آدرس استخراج کنید: ${url}. فقط یک شیء JSON با کلیدهای name و description برگردانید.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: productDetailsSchema,
      },
    });

    // Fixed: Use .text property instead of .text()
    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response from AI");
    const details = JSON.parse(jsonText);
    return details;

  } catch (error) {
    console.error("خطا در دریافت اطلاعات محصول:", error);
    throw new Error("دریافت اطلاعات محصول ناموفق بود. لطفاً از یک آدرس دیگر استفاده کنید یا اطلاعات را دستی وارد نمایید.");
  }
};

export const identifyProductFromImage = async (base64Image: string, mimeType: string): Promise<{ name: string, description: string }> => {
  try {
    // Fixed: Use initialization variable name 'ai' as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };
    const textPart = {
      text: 'این چه محصولی است؟ لطفاً نام و توضیحات کوتاه آن را در قالب یک شیء JSON با کلیدهای name و description برگردانید.',
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: productDetailsSchema,
      },
    });

    // Fixed: Use .text property instead of .text()
    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response from AI");
    const details = JSON.parse(jsonText);
    return details;
    
  } catch (error) {
    console.error("خطا در شناسایی محصول از تصویر:", error);
    throw new Error("شناسایی محصول ناموفق بود. لطفاً دوباره امتحان کنید یا اطلاعات را دستی وارد نمایید.");
  }
};
