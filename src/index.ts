import { ChatOllama } from '@langchain/ollama';
import docs from './docs';

async function agentServe() {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'deepseek-r1:14b',
    numCtx: 50000,
    stop: ['<|im_start|>', '<|im_end|>', '<|im_sep|>'],
  });
  const result = await model.invoke([
    { role: 'system', content: 'XSea是一个性能测试平台' },
    { role: 'system', content: '你是最熟悉XSea性能测试平台的AI助手' },
    { role: 'system', content: '下面是XSea性能测试平台的文档。你需要以性能测试为背景，深入理解这些文档的内容，并以此文档为基础解答用户的使用问题或者概念性问题' },
    { role: 'system', content: `这是文档内容：\n\n${docs}\n\n` },
    { role: 'system', content: '避免提及你是从上下文中获取的信息，并根据用户问题的语言来回答。如果你不知道，就直说你不知道。如果你不确定，就寻求澄清' },
    { role: 'user', content: '脚本有哪些' },
  ]);
  return result.content;
}

async function main() {
  const a = await agentServe();
  console.log(a);
}

main();
