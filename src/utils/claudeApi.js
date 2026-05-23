import Anthropic from '@anthropic-ai/sdk';

function createClient(apiKey) {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function experienceLabel(profile) {
  if (profile.userType === 'student') return 'Student (no work experience)';
  if (profile.userType === 'fresher') return 'Fresher (0–1 year experience)';
  return `${profile.yearsExp} year${Number(profile.yearsExp) > 1 ? 's' : ''} of work experience`;
}

function buildQuestionPrompt(profile, cvText, jdText) {
  const stageInstructions = {
    'HR Round': 'behavioral and situational questions (Tell me about yourself, strengths/weaknesses, motivation, culture fit, why this company)',
    'Technical Round': 'role-specific technical questions based on skills and technologies mentioned in the JD and CV',
    'Leadership Round': 'questions about leadership philosophy, team management, conflict resolution, strategic thinking, and vision',
    'Not yet scheduled': 'a balanced mix of behavioral, technical, and situational questions covering the full spectrum',
  };

  return `You are an expert interview coach helping Indian students and young professionals prepare for job interviews.

Generate exactly 5 personalized interview questions for the following candidate.

CANDIDATE PROFILE:
- Name: ${profile.name}
- Experience Level: ${experienceLabel(profile)}
- Target Role: ${profile.targetRole}
- Target Company Type: ${profile.companyType}
- Interview Stage: ${profile.interviewStage}

JOB DESCRIPTION:
${jdText.slice(0, 2500)}

CV / RESUME CONTENT:
${cvText.slice(0, 2500)}

INSTRUCTIONS:
- Generate ${stageInstructions[profile.interviewStage] || stageInstructions['Not yet scheduled']}
- Tailor questions to the candidate's experience level and target role
- Reference specific skills, experiences, or responsibilities from the JD and CV
- Make questions realistic and challenging but fair for the stage
- Each question should test something different

Return ONLY a valid JSON array — no markdown code fences, no explanation, just raw JSON:
[
  {
    "id": 1,
    "question": "Full question text here?",
    "type": "behavioral",
    "hint": "Tip: focus on X, Y, Z — mention specific outcomes"
  }
]`;
}

function buildEvaluationPrompt(questions, answers, profile, jdText, cvText) {
  const transcript = questions
    .map(q => `Q${q.id}: ${q.question}\nAnswer: ${answers[q.id] || '(No answer provided)'}`)
    .join('\n\n');

  return `You are an expert interview evaluator assessing a candidate's mock interview performance.

CANDIDATE: ${profile.name} | Target Role: ${profile.targetRole} | Company Type: ${profile.companyType}
INTERVIEW STAGE: ${profile.interviewStage} | Experience: ${experienceLabel(profile)}

JOB DESCRIPTION (key excerpts):
${jdText.slice(0, 1500)}

CV SUMMARY:
${cvText.slice(0, 1500)}

INTERVIEW TRANSCRIPT:
${transcript}

EVALUATION TASK:
Score each answer 0–10 on four dimensions:
- relevance: How directly and completely does the answer address the question?
- examples: Does the candidate use specific, concrete examples vs vague generalities?
- clarity: Is the answer well-structured, concise, and easy to follow?
- confidence: Does the language show confidence, ownership, and self-awareness?

Then provide:
- overallScore (0–100): weighted average across all answers, considering answer quality and interview readiness
- jdMatchPercent (0–100): how well the candidate's background and answers align with the JD's requirements
- 3 specific strengths demonstrated in this interview (be specific, not generic)
- 3 specific areas for improvement with actionable advice
- overallFeedback: 2–3 sentences — encouraging but honest assessment

Return ONLY valid JSON — no markdown, no explanation:
{
  "overallScore": 72,
  "jdMatchPercent": 65,
  "questionFeedback": [
    {
      "questionId": 1,
      "score": 7,
      "scores": { "relevance": 8, "examples": 6, "clarity": 7, "confidence": 7 },
      "feedback": "Good answer with a clear opening. Strengthen it by adding a specific measurable outcome from your experience."
    }
  ],
  "strengths": [
    "Demonstrates clear communication with a logical answer structure",
    "Shows genuine enthusiasm and research about the target role",
    "Handles situational questions with a practical, problem-solving mindset"
  ],
  "improvements": [
    "Use the STAR method (Situation, Task, Action, Result) for behavioral questions — your answers lack the Result step",
    "Quantify achievements — replace 'improved performance' with specific numbers or percentages",
    "Tailor answers more directly to the JD's key requirements"
  ],
  "overallFeedback": "You demonstrated solid communication and genuine motivation for this role. With more structured, example-driven answers and stronger alignment to the JD's key requirements, you're on track to perform well in real interviews."
}`;
}

export async function generateQuestions(apiKey, profile, cvText, jdText) {
  const client = createClient(apiKey);
  const prompt = buildQuestionPrompt(profile, cvText, jdText);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse questions from AI response. Please try again.');

  const questions = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('AI returned an unexpected format. Please try again.');
  }
  return questions;
}

export async function evaluateAnswers(apiKey, questions, answers, profile, jdText, cvText) {
  const client = createClient(apiKey);
  const prompt = buildEvaluationPrompt(questions, answers, profile, jdText, cvText);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse evaluation from AI response. Please try again.');

  return JSON.parse(jsonMatch[0]);
}
