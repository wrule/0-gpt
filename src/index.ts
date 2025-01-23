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

function generateKeywordPrompt(subject: string): string {
  const positiveExamples = [
    `"last year's ${subject}" -> "last"`,
    `"John's ${subject}" -> "John"`,
    `"the red ${subject}" -> "red"`,
    `"profitable ${subject}" -> "profitable"`,
    `"completed ${subject}" -> "completed"`,
    `"urgent ${subject}" -> "urgent"`,
    `"Bob's new ${subject}" -> "Bob"`,
    `"failed ${subject}" -> "failed"`,
    `"active ${subject}" -> "active"`,
    `"2024's ${subject}" -> "2024"`
  ];

  const negativeExamples = [
    `"machine learning ${subject}" -> "" (multiple words not allowed)`,
    `"John's nice ${subject}" -> "" (multiple modifiers, unclear which is primary)`,
    `"the ${subject}" -> "" (auxiliary words only)`,
    `"very good ${subject}" -> "" (multiple words)`,
    `"pending and completed ${subject}" -> "" (multiple states)`,
    `"user's archived ${subject}" -> "" (multiple modifiers)`,
    `"the latest successful ${subject}" -> "" (too many modifiers)`,
    `"some ${subject}" -> "" (non-essential modifier)`,
    `"all the ${subject}" -> "" (auxiliary words only)`,
    `"these important ${subject}" -> "" (multiple words)`
  ];

  return (
    'Extract exactly one word that most essentially modifies ${subject} from the query. Must follow these rules:\n' +
    '1. Must be a single word only\n' +
    '2. Must remove all auxiliary words/particles\n' +
    '3. Must be from original text\n' +
    '4. Must directly modify ${subject}\n' +
    '5. Return empty if unclear\n\n' +
    'Correct examples:\n' + 
    positiveExamples.join('\n') +
    '\n\nIncorrect examples:\n' +
    negativeExamples.join('\n')
  );
}

async function main() {
  const zParams = z.object({
    keyword: z.string().describe(generateKeywordPrompt('产品')),
    pageNum: z.number().min(1).default(1).describe('Page number, starting from 1'),
    pageSize: z.number().min(1).max(100).default(10).describe('Number of items per page'),
  });
  const parser = StructuredOutputParser.fromZodSchema(zParams);
  const prompt = `${
    `User needs are: ${'我想查看蓝玉的产品，每页数量多一些'}`
  }\n\n${
    parser.getFormatInstructions().trim()
  }\n\n${
    'Be sure to only output the json object, avoid explaining the json structure, and avoid explaining other related content'
  }`.trim();
  const result = await send(prompt);
  console.log(result);
  const params = await parser.parse(result);
  console.log(params);
  const a = await productPage(params);
  console.log(a);
}

main();
