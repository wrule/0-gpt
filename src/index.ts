import { ChatOllama } from '@langchain/ollama';

async function translate(content: string, source: string, target: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  const result = await model.invoke(["human", `请帮我把[${content}]这段文本由(${source})翻译成为(${target})，翻译后的文本放在[]之间`]);
  console.log(result.content);
}

async function whoAreYou(role: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  const result = await model.invoke([
    { role: 'system', content: `请你模仿自己是${role}与用户对话，在对话中时刻记住自己是${role}不要暴露自己是人工智能，避免提及正在模仿${role}` },
    { role: 'user', content: '你是谁？' },
  ]);
  console.log(result.content);
}

async function intentRecognition(intents: string[], message: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  
  const prompt = [
    {
      role: 'system',
      content: `你是一个意图识别专家。你需要从以下意图列表中选择一个最匹配的意图：${intents.join('、')}。
      只需要返回对应的意图，不要添加任何解释。如果没有匹配的意图，返回"未知意图"。`
    },
    {
      role: 'human',
      content: `用户消息：${message}`
    }
  ];

  const result = await model.invoke(prompt);
  return result.content;
}

async function main() {
  const userIntent = await intentRecognition([
    '想吃饭',
    '想运动',
    '想学习',
    '想工作',
    '想创建压测',
    '想编写测试脚本',
    '想旅行',
  ], '汉堡很美味');
  console.log(userIntent);
  // whoAreYou('熟悉JMeter的专家');
  // // translate('我目前在杭州笨马网络技术有限公司工作', '汉语', '英语');
}

main();
