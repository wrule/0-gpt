import { ChatOllama } from '@langchain/ollama';

async function translate(content: string, source: string, target: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
    numCtx: 16384,
    stop: ['<|im_start|>', '<|im_end|>', '<|im_sep|>'],
  });
  const result = await model.invoke([
    { role: 'user', content: `js之中，let a = 1892 + 1; \n${
      Array(1000).fill(0).map(() => '// 普通注释').join('\n')
    }\na等于多少，你给我数字即可，避免说其他多余的话` },
  ]);
  return result.content;
}

async function main() {
  const a = await translate('你是一个程序员吗？', '中文', '日文');
  console.log(a);
}

main();
