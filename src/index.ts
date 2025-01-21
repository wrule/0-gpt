import { ChatOllama } from '@langchain/ollama';

async function translate(content: string, source: string, target: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  const result = await model.invoke(["human", `请帮我把[${content}]这段文本由(${source})翻译成为(${target})，翻译后的文本放在[]之间`]);
  console.log(result.content);
}

async function main() {
  const a = await translate('你是一个程序员吗？', '中文', '日文');
}

main();
