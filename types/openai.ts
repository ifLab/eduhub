import { OPENAI_API_TYPE } from '../utils/app/const';
import keys from '@/dify_keys.json';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  key: string;
}


export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  写作导师 = '写作导师',
  项目分析 = '项目分析',
  同伴学习 = '同伴学习',
  决策讨论 = '决策讨论',
  课程规划 = '课程规划',
  挑战识别 = '挑战识别',
  测试生成 = '测试生成',
  智能助手 = '智能助手',
  课程助教 = '课程助教',
  校园助手 = '校园助手',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: '默认模型',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['gpt-3.5-turbo'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.写作导师]: {
    id: OpenAIModelID.写作导师,
    name: '写作导师',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['写作导师'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.项目分析]: {
    id: OpenAIModelID.项目分析,
    name: '项目分析',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['项目分析'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.同伴学习]: {
    id: OpenAIModelID.同伴学习,
    name: '同伴学习',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['同伴学习'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.决策讨论]: {
    id: OpenAIModelID.决策讨论,
    name: '决策讨论',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['决策讨论'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.课程规划]: {
    id: OpenAIModelID.课程规划,
    name: '课程规划',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['课程规划'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.挑战识别]: {
    id: OpenAIModelID.挑战识别,
    name: '挑战识别',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['挑战识别'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.测试生成]: {
    id: OpenAIModelID.测试生成,
    name: '测试生成',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['测试生成'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.智能助手]: {
    id: OpenAIModelID.智能助手,
    name: '智能助手',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['智能助手'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.课程助教]: {
    id: OpenAIModelID.课程助教,
    name: '课程助教',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['课程助教'] || process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.校园助手]: {
    id: OpenAIModelID.校园助手,
    name: '校园助手',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['校园助手'] || process.env.DIFY_API_KEY || '',
  },
};