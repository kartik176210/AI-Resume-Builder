// Vercel serverless function (Node runtime).
// POST /api/generate-resume
// Body: { fullName, title, yearsExperience, targetRole, background }
// Requires ANTHROPIC_API_KEY set in the Vercel project's Environment Variables.

export const config = { runtime: 'nodejs' };

interface RequestBody {
  fullName?: string;
  title?: string;
  yearsExperience?: string;
  targetRole?: string;
  background?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Access the runtime environment through globalThis so Vercel's isolated
  // function type-checker does not require a project-level Node tsconfig.
  const apiKey = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
    return;
  }

  const body: RequestBody = req.body || {};
  const { fullName = '', title = '', yearsExperience = '', targetRole = '', background = '' } = body;

  if (!background.trim()) {
    res.status(400).json({ error: 'Please describe your background before generating.' });
    return;
  }

  const prompt = `You are a professional resume writer. Based on the details below, write resume content.
Respond ONLY with valid JSON, no markdown fences, no preamble, matching this exact shape:
{"summary": "2-3 sentence professional summary", "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"], "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"]}

Candidate name: ${fullName || 'Not provided'}
Current/desired title: ${title || targetRole || 'Not provided'}
Target role: ${targetRole || 'Not provided'}
Years of experience: ${yearsExperience || 'Not provided'}
Background, projects, and strengths described by the candidate:
"""
${background}
"""

Write bullets as strong, quantified achievement statements starting with action verbs (Led, Built, Increased, etc.), inferring reasonable metrics only when the background implies them — do not invent specific employers or fabricate unrelated facts. Keep the summary concise and tailored to the target role.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `AI provider error: ${errText.slice(0, 300)}` });
      return;
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b: any) => b.type === 'text');
    const raw = (textBlock?.text || '').trim();
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed: { summary?: string; bullets?: string[]; skills?: string[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      res.status(502).json({ error: 'AI response was not valid JSON. Please try again.' });
      return;
    }

    res.status(200).json({
      summary: parsed.summary || '',
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown server error.' });
  }
}
