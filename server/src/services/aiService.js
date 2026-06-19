export async function createMeetingIntelligence(meeting) {
  const transcriptText = meeting.transcript.map((line) => `${line.speaker}: ${line.text}`).join("\n");

  if (!transcriptText.trim()) {
    return {
      summary: "No transcript was captured yet. Add notes or live transcript lines before generating AI intelligence.",
      actionItems: []
    };
  }

  if (process.env.AI_PROVIDER === "openai" && process.env.OPENAI_API_KEY) {
    return createOpenAIIntelligence(transcriptText);
  }

  // Mock mode keeps the project free to run for evaluators.
  const sentences = transcriptText
    .split(/[.!?]\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const summary = sentences.slice(0, 4).join(". ") + (sentences.length ? "." : "");
  const actionItems = sentences
    .filter((sentence) => /(follow|prepare|share|review|fix|create|send|complete|update)/i.test(sentence))
    .slice(0, 5)
    .map((sentence) => ({
      text: sentence.replace(/^[^:]+:\s*/, ""),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }));

  return {
    summary: summary || "The meeting covered project progress, blockers, ownership, and next steps.",
    actionItems:
      actionItems.length > 0
        ? actionItems
        : [{ text: "Review meeting notes and confirm next owners.", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }]
  };
}

async function createOpenAIIntelligence(transcriptText) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Return valid JSON with keys summary and actionItems. actionItems must be an array of objects with text and optional dueDate."
        },
        {
          role: "user",
          content: `Create an executive meeting summary and clear action items from this transcript:\n\n${transcriptText}`
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider failed: ${detail}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    summary: parsed.summary || "Summary could not be generated.",
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems.map((item) => ({
          text: item.text || String(item),
          dueDate: item.dueDate ? new Date(item.dueDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }))
      : []
  };
}
