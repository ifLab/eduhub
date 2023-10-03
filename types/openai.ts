import { OPENAI_API_TYPE } from '../utils/app/const';
import keys from '@/dify_keys.json';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  key: string;
}

// import HomeContext from '@/pages/api/home/home.context';
// import { useContext } from 'react';
// const {
//   state: { apiKey }, // 把json key表传进来
// } = useContext(HomeContext);

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  信息网络问答 = '信息网络问答',
  财务问答 = '财务问答',
  教务问答 = '教务问答',
  开源软件开发技术问答 = '开源软件开发技术问答',
  临时智能插件 = '临时智能插件',
  // GPT_3_5_AZ = 'gpt-35-turbo',
  // GPT_4 = 'gpt-4',
  // GPT_4_32K = 'gpt-4-32k',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  // [OpenAIModelID.GPT_3_5]: {
  //   id: OpenAIModelID.GPT_3_5,
  //   name: 'GPT-3.5',
  //   maxLength: 12000,
  //   tokenLimit: 4000,
  // },
  // [OpenAIModelID.GPT_3_5_AZ]: {
  //   id: OpenAIModelID.GPT_3_5_AZ,
  //   name: 'GPT-3.5',
  //   maxLength: 12000,
  //   tokenLimit: 4000,
  // },
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: '默认模型',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys['gpt-3.5-turbo']||process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.信息网络问答]: {
    id: OpenAIModelID.信息网络问答,
    name: '信息网络问答',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys.信息网络问答||process.env.DIFY_API_KEY || ''
  },
  [OpenAIModelID.财务问答]: {
    id: OpenAIModelID.财务问答,
    name: '财务问答',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys.财务问答||process.env.DIFY_API_KEY || ''
  },
  [OpenAIModelID.教务问答]: {
    id: OpenAIModelID.教务问答,
    name: '教务问答',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys.教务问答||process.env.DIFY_API_KEY || ''
  },
  [OpenAIModelID.开源软件开发技术问答]: {
    id: OpenAIModelID.开源软件开发技术问答,
    name: '开源软件开发技术',
    maxLength: 12000,
    tokenLimit: 4000,
    key: keys.开源软件开发技术问答||process.env.DIFY_API_KEY || ''
  },
  [OpenAIModelID.临时智能插件]: {
    id: OpenAIModelID.临时智能插件,
    name: '临时智能插件',
    maxLength: 12000,
    tokenLimit: 4000,
    key: process.env.DIFY_API_KEY || ''
  },
};
