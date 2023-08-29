import { IconFolderPlus, IconMistOff, IconPlus } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CloseSidebarButton,
  OpenSidebarButton,
} from './components/OpenCloseButton';

import Search from '../Search';


import HomeContext from '@/pages/api/home/home.context';
import { useContext } from 'react';

interface Props<T> {
  isOpen: boolean;
  addItemButtonTitle: string;
  side: 'left' | 'right';
  items: T[];
  itemComponent: ReactNode;
  folderComponent: ReactNode;
  footerComponent?: ReactNode;
  searchTerm: string;
  handleSearchTerm: (searchTerm: string) => void;
  toggleOpen: () => void;
  handleCreateItem: () => void;
  handleCreateFolder: () => void;
  handleDrop: (e: any) => void;
}

const Sidebar = <T,>({
  isOpen,
  addItemButtonTitle,
  side,
  items,
  itemComponent,
  folderComponent,
  footerComponent,
  searchTerm,
  handleSearchTerm,
  toggleOpen,
  handleCreateItem,
  handleCreateFolder,
  handleDrop,
}: Props<T>) => {
  const { t } = useTranslation('promptbar');

  const {
    state: { lightMode },
  } = useContext(HomeContext);

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#E4F9F5';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  return isOpen ? (
    <div>
      <div
        // className={`fixed top-0 ${side}-0 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0`}
        className={`fixed top-0 ${side}-0 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 p-2 text-[14px] transition-all sm:relative sm:top-0  ${lightMode === 'red' ? 'bg-[#F2ECBE]' : lightMode === 'blue' ? 'bg-[#F6F4EB]' : lightMode === 'green' ? 'bg-[#FAF1E4]' : lightMode === 'purple' ? 'bg-[#C5DFF8]' : lightMode === 'brown' ? 'bg-[#F4EEE0]' :'bg-[#F6F6F6] dark:bg-[#343541]'}`}
      >
        {/* "新建聊天 css" */}
        <div className="flex items-center">
          <button
            className="dark:text-white dark:border border-black/30 text-sidebar flex w-[190px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-black/30 p-3 text-black transition-colors duration-200 hover:bg-gray-500/30"
            onClick={() => {
              handleCreateItem();
              handleSearchTerm('');
            }}
          >
            <IconPlus size={16} />
            {addItemButtonTitle}
          </button>

          {/* "新建文件夹 css" */}
          <button
            className="dark:text-white ml-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-black/30 p-3 text-sm text-black transition-colors duration-200 hover:bg-gray-500/30"
            onClick={handleCreateFolder}
          >
            <IconFolderPlus size={16} />
          </button>
        </div>
        <Search
          placeholder={t('Search...') || ''}
          searchTerm={searchTerm}
          onSearch={handleSearchTerm}
        />

        {/* items 是一个数组，如果长度大于 0，渲染文件夹组件；否则，渲染提示文本. */}
        <div className="flex-grow overflow-auto">
          {items?.length > 0 && (
            <div className="flex border-b border-white/20 pb-2">
              {folderComponent}
            </div>
          )}

          {items?.length > 0 ? (
            <div
              className="pt-2"
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onDragEnter={highlightDrop}
              onDragLeave={removeHighlight}
            >
              {itemComponent}
            </div>
          ) : (
            <div className="dark:text-white mt-8 select-none text-center text-black opacity-50">
              <IconMistOff className="mx-auto mb-3" />
              <span className="text-[14px] leading-normal">
                {t('No data.')}
              </span>
            </div>
          )}
        </div>
        {footerComponent}
      </div>

      <CloseSidebarButton onClick={toggleOpen} side={side} />
    </div>
  ) : (
    <OpenSidebarButton onClick={toggleOpen} side={side} />
  );
};

export default Sidebar;
