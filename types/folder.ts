export interface FolderInterface {
  id: string;
  name: string;
  type: FolderType;
  deletable: boolean; 
  openable: boolean; 
}

export type FolderType = 'chat' | 'prompt';
