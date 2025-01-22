import { ChatOllama } from '@langchain/ollama';
import axios from 'axios';

async function productPage(params?: { name?: string, pageNum?: number, pageSize?: number }) {
  const name = params?.name ?? '';
  const pageNum = params?.pageNum ?? 1;
  const pageSize = params?.pageSize ?? 10;
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
    { role: 'user', content: '我想查看产品列表' },
  ]);
  console.log(result.content);
}

async function main() {
  // test();
  console.log(await productPage());
}

main();
