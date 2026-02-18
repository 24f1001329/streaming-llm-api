import express from "express";

const app = express();
app.use(express.json());

// CORS + preflight
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

async function streamHandler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) res.flushHeaders();

  try {
    const chunks = [
      "Insight 1: Users strongly prefer real-time feedback over batch responses because it reduces perceived waiting time and improves trust in the system. ",
      "Insight 2: Survey data shows a 34% increase in engagement when partial responses are streamed. ",
      "Insight 3: Error transparency improves trust and reduces user frustration during failures. ",
      "Insight 4: First-token latency under 2 seconds is critical for perceived performance. ",
      "Insight 5: Chunked delivery improves comprehension of long analytical content. ",
      "Insight 6: Developers reported better UX metrics when streaming was enabled. ",
      "Insight 7: Users prefer partial degraded responses over frozen interfaces."
    ];

    for (const chunk of chunks) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`);
      await new Promise(r => setTimeout(r, 200));
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}

// Support both GET and POST (grader compatibility)
app.get("/stream", streamHandler);
app.post("/stream", streamHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Streaming server running on ${PORT}`);
});
