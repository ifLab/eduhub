import {
  IconCaretDown,
  IconCaretRight,
  IconCheck,
  IconPencil,
  IconTrash,
  IconX,

  IconFolder,
  IconActivityHeartbeat,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight,faArrowRight,faLightbulb,faGraduationCap,faCode,faBook } from '@fortawesome/free-solid-svg-icons';


import { FolderInterface } from '@/types/folder';

import HomeContext from '@/pages/api/home/home.context';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';

// 展示文件夹的名称，处理文件夹的删除和重命名操作，以及展示与文件夹关联的组件内容。
// 同时，还提供了拖放功能，可以将会话拖放到文件夹中更新其文件夹信息。

// 定义 Props 接口，包含了以下属性：
interface Props {
  // 表示当前文件夹的信息
  currentFolder: FolderInterface;
  // 搜索词
  searchTerm: string;
  // 表示拖放操作的处理函数，接受事件对象和文件夹信息作为参数，无返回值。
  handleDrop: (e: any, folder: FolderInterface) => void;
  // 表示文件夹关联的组件，类型为 ReactElement 数组。
  folderComponent: (ReactElement | undefined)[];
}

const Folder = ({
  currentFolder,
  searchTerm,
  handleDrop,
  folderComponent,
}: Props) => {
  // 通过 useContext 钩子获取了上下文中的 handleDeleteFolder 和 handleUpdateFolder 函数。
  const { handleDeleteFolder, handleUpdateFolder } = useContext(HomeContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 按下 Enter 键时执行重命名操作
  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };

  // 执行重命名操作
  const handleRename = () => {
    handleUpdateFolder(currentFolder.id, renameValue);
    setRenameValue('');
    setIsRenaming(false);
  };

  // 处理拖放事件
  const dropHandler = (e: any) => {
    if (e.dataTransfer) {
      setIsOpen(true);

      handleDrop(e, currentFolder);

      e.target.style.background = 'none';
    }
  };

  // 允许拖放事件发生
  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  // 在拖放目标上添加高亮效果。当拖动对象进入文件夹区域时，它会将拖放目标的背景色设置为指定的颜色。
  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  // 移除拖放目标的高亮效果。当拖动对象离开文件夹区域时，它会将拖放目标的背景色恢复为默认值。
  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  // 检查当前是否正在进行重命名或删除操作，并根据情况更新另一个状态。
  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  // 根据搜索词的输入状态自动展开或关闭文件夹。
  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  return (
    <>
      <div className="relative flex items-center">
        {/* 根据 isRenaming 的状态确定组件的渲染方式。
        如果正在进行重命名操作，则显示一个带有输入框的区域，用于输入新的文件夹名称。 */}
        {isRenaming ? (
          <div className="flex w-full items-center gap-3 bg-gray-500/30 p-3">
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <input
              // className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-black dark:text-white outline-none focus:border-neutral-100"
              className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleEnterDown}
              autoFocus
            />
          </div>
        ) : (
          // 如果不在重命名操作，而是正常的文件夹显示状态，则显示一个按钮区域，包括文件夹的展开/折叠图标和文件夹名称。
          <button
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-gray-500/30`}
            onClick={() => setIsOpen(!isOpen)}
            onDrop={(e) => dropHandler(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            {/* {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )} */}

          {currentFolder.isDefault ? (
              currentFolder.name === "课程助手" ? (
                <FontAwesomeIcon icon={faBook} style={{ height: '16px', width: '16px' }} fixedWidth />
              ) : currentFolder.name === "校园助理" ? (
                <FontAwesomeIcon icon={faGraduationCap} style={{ height: '16px', width: '16px'}} fixedWidth />
              ) : currentFolder.name === "智能插件" ? (
                <FontAwesomeIcon icon={faCode} style={{ height: '16px', width: '16px' }} fixedWidth />
              ) : (
                isOpen ? <IconCaretDown size={18} /> : <IconCaretRight size={18} />
              )
            ) : (
              isOpen ? <IconCaretDown size={18} /> : <IconCaretRight size={18} />
            )}

            <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3">
              {currentFolder.name}
            </div>
          </button>
        )}

        {/* 在删除或重命名操作时，会显示一个绝对定位的操作按钮区域，其中包括确认和取消按钮。 */}
        {(isDeleting || isRenaming) && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();

                if (isDeleting) {
                  handleDeleteFolder(currentFolder.id);
                } else if (isRenaming) {
                  handleRename();
                }

                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconCheck size={18} />
            </SidebarActionButton>
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconX size={18} />
            </SidebarActionButton>
          </div>
        )}

        {/* 如果既不在删除/重命名操作，也没有展开文件夹，则不显示任何内容。 */}
        {!isDeleting && !isRenaming && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setRenameValue(currentFolder.name);
              }}
            >
              <IconPencil size={18} />
            </SidebarActionButton>
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
            >
              <IconTrash size={18} />
            </SidebarActionButton>
          </div>
        )}
      </div>

      {/* 根据 isOpen 的状态决定是否显示文件夹内容。 */}
      {isOpen ? folderComponent : null}
    </>
  );
};

export default Folder;
