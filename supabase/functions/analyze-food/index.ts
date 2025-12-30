import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
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

    console.log('Step 1: Detecting food items from image...');

    // Step 1: Only detect food items and determine what clarification questions are needed
    const systemPrompt = `You are a professional nutritionist AI that analyzes food images.

Your task is to ONLY identify the food items visible in the image and determine what clarification questions need to be asked before calculating nutrition.

For each food item, identify:
1. The name of the food
2. Estimated portion size
3. What ingredient variations are possible (flour type, oil type, cooking method, sweetener)

You MUST respond with valid JSON in this exact format:
{
  "items": [
    {
      "name": "<food item name>",
      "quantity": "<portion size like '150g' or '1 cup' or '2 pieces'>",
      "needsClarification": true/false,
      "clarificationQuestions": [
        {
          "questionId": "<oil|flour|cooking|sugar>",
          "question": "<human readable question>",
          "options": [
            {"id": "<option_id>", "label": "<display label>", "isDefault": true/false}
          ]
        }
      ]
    }
  ],
  "mealDescription": "<brief description of the overall meal>"
}

Guidelines for clarification questions:
- "oil": Ask about oil type for fried/cooked items (olive oil, vegetable oil, ghee, coconut oil, no oil)
- "flour": Ask about flour type for breads/rotis/puris (whole wheat, refined maida, millet, multigrain)
- "cooking": Ask about cooking method for items that could be prepared differently (deep fried, pan fried, air fried, baked, steamed, grilled, boiled)
- "sugar": Ask about sweetener for sweet items (white sugar, brown sugar, honey, jaggery, stevia, no sugar)

Only include relevant questions for each food item. For example:
- Puri: Ask about flour type, oil type, and cooking method
- Plain rice: No questions needed (needsClarification: false)
- Gulab jamun: Ask about flour type, sugar type, and cooking method

Set isDefault: true for the most common preparation method.`;

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
            content: [
              { type: 'text', text: 'Identify the food items in this image and determine what clarification questions are needed about ingredients and preparation methods.' },
              { 
                type: 'image_url', 
                image_url: { 
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` 
                } 
              }
            ]
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
        JSON.stringify({ error: 'Failed to analyze image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log('AI response received:', aiResponse?.substring(0, 300));

    // Parse the JSON from AI response
    let detectionResult;
    try {
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      detectionResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse detection results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if any item needs clarification
    const needsClarification = detectionResult.items.some((item: any) => item.needsClarification);

    console.log('Detection complete. Items:', detectionResult.items.length, 'Needs clarification:', needsClarification);

    return new Response(
      JSON.stringify({
        step: 'detection',
        needsClarification,
        ...detectionResult,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing food:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
