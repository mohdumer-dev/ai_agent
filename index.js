import Groq from "groq-sdk";
import env from "dotenv";
import readline from "readline-sync";
env.config();

const groq = new Groq({
  apiKey: "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",
});

// tools function
function getWeatherDetails(city) {
  if (city.toLowerCase() === "delhi") {
    return "15°C";
  }
  if (city.toLowerCase() === "srinagar") {
    return "-5°C";
  }
  if (city.toLowerCase() === "mumbai") {
    return "40°C";
  }
  if (city.toLowerCase() === "berlin") {
    return "32°C";
  }
}
const tools = {
  getWeatherDetails: getWeatherDetails,
};
const user = "What is the weather of delhi?";
const SYSTEM_PROMPT = `
You are an AI Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.

After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START propmt and observations

Available Tools:
-function getWeatherDetails (city: string): string

Strictly follow JSON object as examples

getWeatherDetails is a function that accepts city name as string and retuns the weather details

Example:
START

{ "type": "user", "user": "What is the sum of weather of Patiala and Mohali?" }
{ "type": "plan", "plan": "I will call the getWeatherDetails for Patiala" }

{ "type": "action", "function": "getWeatherDetails", "input": "patiala" }
{ "type": "observation", "observation": "10°C" }

{ "type": "plan", "plan": "I will call getWeatherDetails for Mohali" }
{ "type": "action", "function": "getWeatherDetails", "input": "mohali" }

{ "type": "observation", "observation": "14°C""}
{ "type": "output", "output": "The sum of weather of Patiala and Mohali is 24°C" }

`;
// const call = async () => {
//   const response = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:SYSTEM_PROMPT
//       },
//       {
//         role: "system",
//         content:`{ "type": "action", "function": "getWeatherDetails", "input": "Delhi" }`
//       },
//       {
//         role: "system",
//         content:`{ "type": "observer", "observer": "14°C"" }`
//       },

//       {
//         role: "user",
//         content: user,
//       },
//     ],
//     model: "llama-3.3-70b-versatile",
//   });
//   console.log(response.choices[0]?.message?.content)
// };
// call()

// message array
const message = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const query = readline.question(">>_-_ ");
  const q = {
    type: "user",
    content: query,
  };
  message.push({ role: "user", content: JSON.stringify(q) });
  while (true) {
    const chat = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: message,
      response_format: { type: "json_object" },
    });
    const result = chat.choices[0]?.message?.content;

    message.push({ role: "system", content: result });
    const call = JSON.parse(result);
    if (call.type === "output") {
      console.log("()--()" + call.output);
      break;
    } else if (call.type === "action") {
      const fn = tools[call.function];
      const observation = fn(call.input);
      const obs = { type: "observation", observation: observation };
      message.push({ role: "developer", content: JSON.stringify(obs) });
    }
  }
}
