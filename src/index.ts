import { ChatOllama } from '@langchain/ollama';

async function main() {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  const result = await model.invoke(["human", "你好"]);
  console.log(result.content);
}

main();
