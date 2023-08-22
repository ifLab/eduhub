import { Prompt } from '@/types/prompt';

// PromptbarInitialState 接口定义了一个初始状态，其中包含两个属性：
// searchTerm：代表搜索关键词的字符串类型属性。
// filteredPrompts：代表过滤后的提示列表的 Prompt[] 类型属性。
export interface PromptbarInitialState {
  searchTerm: string;
  filteredPrompts: Prompt[];
}

export const initialState: PromptbarInitialState = {
  searchTerm: '',
  filteredPrompts: [],
};
