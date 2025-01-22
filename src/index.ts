import { ChatOllama } from '@langchain/ollama';
import axios from 'axios';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

async function productPage(params?: { keyword?: string, pageNum?: number, pageSize?: number }) {
  const name = params?.keyword ?? '';
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

async function send(message: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });
  const result = await model.invoke([
    { role: 'user', content: message },
  ]);
  return result.content as string;
}

async function main() {
  const zParams = z.object({
    keyword: z.string(),
    pageNum: z.number(),
    pageSize: z.number(),
  });
  const parser = StructuredOutputParser.fromZodSchema(zParams);
  const prompt = `${
    `User needs are: ${'给我图图的产品'}`
  }\n\n${
    `Your task is: Generate a JSON parameter to call the paging API of the product list`
  }\n\n${
    parser.getFormatInstructions().trim()
  }\n\n${
    'Be sure to only output the json object, avoid explaining the json structure, and avoid explaining other related content'
  }`.trim();
  const result = await send(prompt);
  console.log(result);
  const params = await parser.parse(result);
  console.log(params);
}

main();
