import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calorie multipliers based on ingredient choices
const ingredientMultipliers: Record<string, Record<string, { multiplier: number; isHealthy: boolean }>> = {
  oil: {
    olive: { multiplier: 1.0, isHealthy: true },
    coconut: { multiplier: 1.05, isHealthy: true },
    vegetable: { multiplier: 1.0, isHealthy: false },
    ghee: { multiplier: 1.15, isHealthy: false },
    mustard: { multiplier: 1.0, isHealthy: true },
    none: { multiplier: 0.7, isHealthy: true },
  },
  flour: {
    wheat: { multiplier: 1.0, isHealthy: true },
    refined: { multiplier: 1.05, isHealthy: false },
    millet: { multiplier: 0.9, isHealthy: true },
    multigrain: { multiplier: 0.95, isHealthy: true },
    almond: { multiplier: 1.1, isHealthy: true },
    chickpea: { multiplier: 0.92, isHealthy: true },
  },
  cooking: {
    deepfried: { multiplier: 1.4, isHealthy: false },
    panfried: { multiplier: 1.15, isHealthy: false },
    airfried: { multiplier: 0.85, isHealthy: true },
    baked: { multiplier: 0.9, isHealthy: true },
    steamed: { multiplier: 0.75, isHealthy: true },
    grilled: { multiplier: 0.85, isHealthy: true },
    boiled: { multiplier: 0.7, isHealthy: true },
    roasted: { multiplier: 0.9, isHealthy: true },
  },
  sugar: {
    white: { multiplier: 1.0, isHealthy: false },
    brown: { multiplier: 0.98, isHealthy: false },
    honey: { multiplier: 0.95, isHealthy: true },
    jaggery: { multiplier: 0.9, isHealthy: true },
    stevia: { multiplier: 0.4, isHealthy: true },
    none: { multiplier: 0.5, isHealthy: true },
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, userAnswers } = await req.json();

    if (!items || !Array.isArray(items)) {
      return new Response(
        JSON.stringify({ error: 'Items array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Step 2: Calculating nutrition based on user answers...');
    console.log('User answers:', JSON.stringify(userAnswers));

    // Build a detailed prompt with user's ingredient choices
    const itemDescriptions = items.map((item: any, index: number) => {
      const answers = userAnswers?.[index] || {};
      let desc = `${item.quantity} of ${item.name}`;
      
      const details: string[] = [];
      if (answers.flour) details.push(`made with ${answers.flour} flour`);
      if (answers.oil) details.push(`cooked in ${answers.oil} oil`);
      if (answers.cooking) details.push(`${answers.cooking}`);
      if (answers.sugar) details.push(`sweetened with ${answers.sugar}`);
      
      if (details.length > 0) {
        desc += ` (${details.join(', ')})`;
      }
      
      return desc;
    }).join('\n- ');

    const systemPrompt = `You are a professional nutritionist AI. Calculate accurate nutrition information based on the specific ingredients and cooking methods provided.

Respond with valid JSON in this exact format:
{
  "calories": <total calories as number>,
  "protein": <grams as number>,
  "carbs": <grams as number>,
  "fats": <grams as number>,
  "items": [
    {
      "name": "<food item name>",
      "quantity": "<portion size>",
      "calories": <calories for this item>,
      "protein": <protein in grams>,
      "carbs": <carbs in grams>,
      "fats": <fats in grams>,
      "tags": ["<tag1>", "<tag2>"]
    }
  ],
  "suggestions": [
    {
      "type": "<positive|warning|tip>",
      "text": "<specific suggestion based on their choices>"
    }
  ],
  "healthClassification": "<Healthy|Moderate|Unhealthy>",
  "healthReason": "<brief explanation of the classification>"
}

Health Classification Guidelines:
- "Healthy": Predominantly healthy ingredients (whole grains, good oils, steamed/baked/grilled), balanced macros
- "Moderate": Mix of healthy and less healthy choices, or portion size considerations
- "Unhealthy": Deep fried, refined flour, high sugar, or excessive fats

Tags can include: "High Protein", "High Carbs", "High Fat", "Low Calorie", "Fiber Rich", "Whole Grain", "Deep Fried", "Low Sugar"

Be precise with calorie calculations considering:
- Cooking method impact (deep frying adds ~40% more calories vs baking)
- Flour type (refined has slightly more calories than whole wheat)
- Oil type and amount used in cooking
- Added sugars`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Calculate nutrition for this meal:\n- ${itemDescriptions}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to calculate nutrition' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log('AI nutrition response:', aiResponse?.substring(0, 300));

    let nutritionResult;
    try {
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      nutritionResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse nutrition results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate overall health score based on user's ingredient choices
    let healthyChoices = 0;
    let totalChoices = 0;

    Object.values(userAnswers || {}).forEach((itemAnswers: any) => {
      Object.entries(itemAnswers || {}).forEach(([category, value]) => {
        const categoryMultipliers = ingredientMultipliers[category];
        if (categoryMultipliers && categoryMultipliers[value as string]) {
          totalChoices++;
          if (categoryMultipliers[value as string].isHealthy) {
            healthyChoices++;
          }
        }
      });
    });

    // Add ingredient-based health info to response
    const ingredientHealthScore = totalChoices > 0 ? healthyChoices / totalChoices : 0.5;

    console.log('Nutrition calculation complete. Total calories:', nutritionResult.calories);

    return new Response(
      JSON.stringify({
        step: 'complete',
        ...nutritionResult,
        ingredientHealthScore,
        userAnswers,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating nutrition:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
