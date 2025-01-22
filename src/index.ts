import { ChatOllama } from '@langchain/ollama';
import axios from 'axios';
import dayjs from 'dayjs';

async function productPage(pageNum = 1, pageSize = 10, name = '') {
  const res = await axios.post('http://10.10.31.20:8081/api/xsea/workspace/list', {
    condition: { name }, pageNum, pageSize,
  }, {
    headers: { Cookie: 'sys_token=d8cad0a8d0b04e9d8e6359aa20cafc42' },
  });
  const data = res.data.object ?? { };
  return {
    list: (data.list ?? []).map((item: any) => ({ name: item.name, id: item.id })),
    total: data.total ?? 0,
    pageNum: data.pageNum ?? 1,
    pageSize: data.pageSize ?? 10,
  };
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
  console.log(await productPage(1, 10, '图图'));
  // await test();
}

main();
