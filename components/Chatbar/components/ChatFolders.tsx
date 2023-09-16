import { useContext } from 'react';

import { FolderInterface } from '@/types/folder';

import HomeContext from '@/pages/api/home/home.context';

import Folder from '@/components/Folder';

import { ConversationComponent } from './Conversation';

// 渲染聊天栏的文件夹列表，并根据搜索词过滤文件夹和关联的会话，同时提供拖放功能以更新会话的文件夹信息。
interface Props {
  searchTerm: string;
}
// 定义了 ChatFolders 组件，接受 searchTerm 属性作为参数。
export const ChatFolders = ({ searchTerm }: Props) => {
  // 通过 useContext 获取了聊天栏的状态和处理函数
  const {
    state: { folders, conversations },
    handleUpdateConversation,
  } = useContext(HomeContext);

  // 处理拖放操作
  const handleDrop = (e: any, folder: FolderInterface) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, {
        key: 'folderId',
        value: folder.id,
      });
    }
  };

  // 在 ChatFolders 函数中，根据当前文件夹遍历过滤出与之关联的会话，并以列表形式渲染。
  // 如果会话的文件夹 ID 与当前文件夹的 ID 相匹配，则渲染 ConversationComponent 组件。
  const ChatFolders = (currentFolder: FolderInterface) => {
    return (
      conversations &&
      conversations
        .filter((conversation) => conversation.folderId)
        .map((conversation, index) => {
          if (conversation.folderId === currentFolder.id) {
            return (
              <div key={index} className="ml-5 gap-2 border-l pl-2">
                <ConversationComponent conversation={conversation} />
              </div>
            );
          }
        })
    );
  };
 
  // 在组件的返回部分，使用 flex 布局，并遍历聊天栏的文件夹列表。
  // 对于每个文件夹，使用 Folder 组件来渲染文件夹项，传入相应的属性和子组件（即文件夹关联的会话列表）。
  return (
    // <div className="flex w-full flex-col pt-2 text-black dark:text-white">
    <div className="flex w-full flex-col pt-2">
      {folders
        .filter((folder) => folder.type === 'chat')
        // .sort((a, b) => a.name.localeCompare(b.name))
        .map((folder, index) => (
          <Folder
            key={index}
            searchTerm={searchTerm}
            currentFolder={folder}
            handleDrop={handleDrop}
            folderComponent={ChatFolders(folder)}
            openable={true}
          />
        ))}
    </div>
  );
};
