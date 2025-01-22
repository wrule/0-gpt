import { ChatOllama } from '@langchain/ollama';
import axios from 'axios';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

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
    name: z.string().default('').describe('任意与产品相关的搜索关键字，你需要根据上下文选择合适的关键字填入'),
    pageNum: z.number().default(1).describe('页码，具体页码你需要根据上下文决定'),
    pageSize: z.number().default(10).describe('每页展示的产品个数，具体数值你需要根据上下文决定'),
  });
  const parser = StructuredOutputParser.fromZodSchema(zParams);
  const prompt = `${'我想查看第一页的产品列表,每页展示多一些'}\n\n${parser.getFormatInstructions()}`.trim();
  const result = await send(prompt);
  const params = await parser.parse(result);
  console.log(params);
}

main();
