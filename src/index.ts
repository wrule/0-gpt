import { ChatOllama } from '@langchain/ollama';
import dayjs from 'dayjs';

function timeNow() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

async function test() {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'deepseek-r1:14b',
  });
  const result = await model.invoke([
    { role: 'user', content: '现在时间是什么？' },
  ]);
  console.log(result.content);
}

async function main() {
  await test();
}

main();
