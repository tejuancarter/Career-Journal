import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIAnalysisResult {
  achievements: Array<{
    title: string
    description: string
    starFormat: string
    skills: string[]
    quantifiableMetrics?: string
    impact?: string
  }>
  insights: {
    topSkills: string[]
    keyAccomplishments: string[]
    careerGrowthAreas: string[]
  }
}

export async function analyzeJournalEntry(
  content: string,
  userRole?: string,
  targetGoals?: string
): Promise<AIAnalysisResult> {
  try {
    const prompt = `
You are an AI career coach analyzing a journal entry. Extract achievements and provide insights.

User Context:
- Current Role: ${userRole || 'Not specified'}
- Career Goals: ${targetGoals || 'Not specified'}

Journal Entry:
"${content}"

Please provide a JSON response with:
1. "achievements": Array of extracted achievements with:
   - title: Brief achievement title
   - description: Detailed description
   - starFormat: STAR format (Situation, Task, Action, Result)
   - skills: Array of skills demonstrated
   - quantifiableMetrics: Any numbers/metrics mentioned
   - impact: Business/organizational impact

2. "insights": Object with:
   - topSkills: Top 5 skills demonstrated
   - keyAccomplishments: Key achievements worth highlighting
   - careerGrowthAreas: Suggested areas for development

Focus on:
- Quantifiable results and impact
- Leadership and collaboration examples
- Technical skills and problem-solving
- Innovation and initiative
- Career progression relevance

Return only valid JSON.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and resume writer. Analyze journal entries to extract meaningful achievements and provide career insights. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from OpenAI')
    }

    try {
      return JSON.parse(result) as AIAnalysisResult
    } catch (_parseError) {
      console.error('Failed to parse OpenAI response:', result)
      // Return a fallback result
      return {
        achievements: [{
          title: 'Journal Entry Analysis',
          description: content.substring(0, 200) + '...',
          starFormat: 'Analysis could not be processed automatically. Please review manually.',
          skills: [],
          quantifiableMetrics: '',
          impact: ''
        }],
        insights: {
          topSkills: [],
          keyAccomplishments: [],
          careerGrowthAreas: []
        }
      }
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}

export async function generateResumeBullets(
  achievements: Array<{
    title: string
    description: string
    skills: string[]
    quantifiableMetrics?: string
    impact?: string
  }>,
  targetRole?: string
): Promise<string[]> {
  try {
    const prompt = `
Generate ATS-friendly resume bullets from the following achievements.

Target Role: ${targetRole || 'General professional role'}

Achievements:
${achievements.map((a, i) => `${i + 1}. ${a.title}: ${a.description}
   Skills: ${a.skills.join(', ')}
   Metrics: ${a.quantifiableMetrics || 'None'}
   Impact: ${a.impact || 'None'}`).join('\n\n')}

Requirements:
- Start with strong action verbs
- Include quantifiable results where possible
- Optimize for ATS keywords relevant to the target role
- Keep each bullet to 1-2 lines
- Focus on impact and results
- Use present tense for current role, past tense for previous

Return only a JSON array of resume bullet strings.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Generate compelling, ATS-optimized resume bullets. Always respond with valid JSON array.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    })

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from OpenAI')
    }

    try {
      return JSON.parse(result) as string[]
    } catch (_parseError) {
      console.error('Failed to parse OpenAI response:', result)
      // Return fallback bullets
      return achievements.map(a => `• ${a.title}: ${a.description.substring(0, 100)}...`)
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}