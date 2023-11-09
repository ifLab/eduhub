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
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {

  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: '默认模型',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['gpt-3.5-turbo']||process.env.DIFY_API_KEY || '',
  },

};
