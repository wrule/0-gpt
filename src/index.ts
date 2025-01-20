import { ChatOllama } from '@langchain/ollama';
import axios from 'axios';

async function translate(content: string, source: string, target: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  const result = await model.invoke(["human", `请帮我把[${content}]这段文本由(${source})翻译成为(${target})，翻译后的文本放在[]之间`]);
  console.log(result.content);
}

async function productList(name: string, pageNum: number, pageSize: number) {
  const res = await axios.post('http://10.10.31.20:8081/api/xsea/workspace/list', {
    pageNum, pageSize, condition: { name },
  }, {
    headers: {
      Cookie: 'sys_token=e2a37364378c447e9a569954e9d114e3',
    },
  });
  const list = (res.data.object?.list ?? []).map((item: any) => ([item.name, item.id]));
  console.log(list);
}

async function main() {
  productList('', 1, 10);
}

main();
