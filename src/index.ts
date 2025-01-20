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
  translate('我目前在杭州笨马网络技术有限公司工作', '汉语', '英语');
}

main();
