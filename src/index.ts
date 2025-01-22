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
    `User needs are: ${'我想查找所有用于测试的产品，看第二页'}`
  }\n\n${
    `Extract the core subject as a 'keyword' parameter for API queries or search operations.

✓ Correct Extractions (Query → keyword):
"I need to check products from 2015" → keyword="2015"
"Show me Tom's academic performance" → keyword="Tom"
"Find information about the solar system" → keyword="solar system"
"What are frontend developer responsibilities" → keyword="frontend"
"MacBook Pro price comparison" → keyword="MacBook Pro"
"我需要查看春节的活动" → keyword="春节"
"帮我找一下王小明的联系方式" → keyword="王小明"

✗ Incorrect Parameter Assignments:
"I need to check products from 2015":
  ✗ keyword="2015 products"
  ✗ keywords=["2015", "products"]
  ✗ params={"year": "2015", "type": "products"}

"Find information about the solar system":
  ✗ keyword="solar system information"
  ✗ search_term="about solar system"
  ✗ query="find solar system"

Core Extraction Rules:
1. Extract ONLY the essential subject as a single keyword value
2. Remove ALL auxiliary elements:
   - Action verbs (check, find, learn, 查看, 搜索)
   - Descriptive modifiers (today's, about, 关于, 怎样)
   - Connective words (of, for, in, 的, 和)
   - Purpose indicators (price, method, 价格, 方法)
   - Personal pronouns (I, me, 我, 他)
3. The extracted keyword should be:
   - A single string value
   - Used directly as the keyword parameter
   - Free from any surrounding modifiers
   - Ready for API query: api.search(keyword="extracted_term")

Example Implementation:
query = "I need to check products from 2015"
extracted_keyword = "2015"
api.search(keyword=extracted_keyword)`
  }\n\n${
    parser.getFormatInstructions().trim()
  }\n\n${
    'Be sure to only output the json object, avoid explaining the json structure, and avoid explaining other related content'
  }`.trim();
  const result = await send(prompt);
  console.log(result);
  const params = await parser.parse(result);
  const a = await productPage(params);
  console.log(a);
}

main();
