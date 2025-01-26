import Groq from "groq-sdk";
import env from "dotenv";
env.config();

const groq = new Groq({
  apiKey: "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",
});

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(
    chatCompletion.choices[0]?.message?.content || "No response received"
  );
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "you are a helpful assistant.Make chat natural, Don'use ** , Also give make the work simple as you are helpful chat assistant",
      },
      {
        role: "user",
        content: "what is python",
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
main();

// 
