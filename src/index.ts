import { ChatOllama } from '@langchain/ollama';
import axios from 'axios';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

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
  return list;
}

async function searchProducts(userQuery: string) {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31351',
    model: 'phi4:latest',
  });

  // 定义输出结构
  const searchParamsSchema = z.object({
    name: z.string(),
    pageNum: z.number(),
    pageSize: z.number(),
  });

  const parser = StructuredOutputParser.fromZodSchema(searchParamsSchema);

  const prompt = `作为一个产品搜索助手，请根据用户的查询需求，提供合适的搜索参数。
用户查询: ${userQuery}

请提供以下参数:
1. name: 搜索关键词（如果用户没有明确指定，请使用空字符串）
2. pageNum: 页码（默认为1）
3. pageSize: 每页条数（默认为10）

${parser.getFormatInstructions()}`;

console.log(prompt);

  try {
    const response: any = await model.invoke(prompt);
    const params = await parser.parse(response.content);
    
    console.log('搜索参数:', params);
    const results = await productList(params.name, params.pageNum, params.pageSize);
    
    // 使用 LLM 解释搜索结果
    const explanation = await model.invoke(`
请解释以下产品搜索结果：
${JSON.stringify(results)}

请用简洁的语言说明找到了多少个产品，并列出它们的名称。
    `);
    
    return {
      searchParams: params,
      results,
      explanation: explanation.content
    };
  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
}

async function main() {
  // 示例查询
  const searchResult = await searchProducts('我想查看第一页的产品列表，每页显示9个产品');
  console.log('搜索结果:', searchResult);
}

main();
