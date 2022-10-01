import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getResponse = async (query: string) => {
  const data = await openai.createCompletion({
    model: "text-ada-001",
    prompt: query,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return data;
};

export default getResponse;
