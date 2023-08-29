export interface FolderInterface {
  id: string;
  name: string;
  type: FolderType;
  isDefault: boolean; // 添加isDefault属性
}

export type FolderType = 'chat' | 'prompt';
