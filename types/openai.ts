import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  key: string;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  信息网络问答 = '信息网络问答',
  CW问答 = 'CW问答',
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
    key: process.env.DIFY_API_KEY || '',
  },
  [OpenAIModelID.信息网络问答]: {
    id: OpenAIModelID.信息网络问答,
    name: '信息网络问答',
    maxLength: 12000,
    tokenLimit: 4000,
    key: "app-hWKy5TqXu6aqJCCk5YjvKOSU"
  },
  [OpenAIModelID.CW问答]: {
    id: OpenAIModelID.CW问答,
    name: 'CW问答',
    maxLength: 12000,
    tokenLimit: 4000,
    key: "app-fWrnEufV91wOR7wHkNxDp0nD"
  },
  [OpenAIModelID.教务问答]: {
    id: OpenAIModelID.教务问答,
    name: '教务问答',
    maxLength: 12000,
    tokenLimit: 4000,
    key: "app-H1PhlZXBEWueIAV7Ur4lO0cW"
  },
  [OpenAIModelID.开源软件开发技术问答]: {
    id: OpenAIModelID.开源软件开发技术问答,
    name: '开源软件开发技术',
    maxLength: 12000,
    tokenLimit: 4000,
    key: "app-N8HGM3yPkMWu8SqhmSsKS8co"
  },
  [OpenAIModelID.临时智能插件]: {
    id: OpenAIModelID.临时智能插件,
    name: '临时智能插件',
    maxLength: 12000,
    tokenLimit: 4000,
    key: "app-H0htKhCMXKbjJ27yMbBdp9UK"
  },
};
