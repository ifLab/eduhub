import { FC, MutableRefObject,useContext } from 'react';

import { Prompt } from '@/types/prompt';
import HomeContext from '@/pages/api/home/home.context';

interface Props {
  prompts: Prompt[];
  activePromptIndex: number;
  onSelect: () => void;
  onMouseOver: (index: number) => void;
  promptListRef: MutableRefObject<HTMLUListElement | null>;
}

export const PromptList: FC<Props> = ({
  prompts,
  activePromptIndex,
  onSelect,
  onMouseOver,
  promptListRef,
}) => {
  const { state: { lightMode } } = useContext(HomeContext);
  let bgColor = ''; // 声明 bgColor 变量，默认为空字符串

  // 根据 lightMode 的值来设置 bgColor 的值
  if (lightMode === 'red') {
    bgColor = 'bg-[#F2ECBE]';
  } else if (lightMode === 'blue') {
    bgColor = 'bg-[#F6F4EB]';
  } else if (lightMode === 'green') {
    bgColor = 'bg-[#FAF1E4]';
  } else if (lightMode === 'purple') {
    bgColor = 'bg-[#C5DFF8]';
  } else if (lightMode === 'brown') {
    bgColor = 'bg-[#F4EEE0]';
  } else if (lightMode === 'BISTU') {
    bgColor = 'bg-[#eef5fd]';
  }

  // 输入 / 时弹出的对话框背景色
  return (
    <ul
      ref={promptListRef}
      className={`z-10 max-h-52 w-full overflow-scroll rounded border border-black/10 ${bgColor} shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-neutral-500 dark:bg-[#343541] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]`}
    >
      {prompts.map((prompt, index) => (
        <li
          key={prompt.id}
          className={`${
            index === activePromptIndex ? 'bg-white/60 dark:bg-[#202123] dark:text-black' : ''
          } cursor-pointer px-3 py-2 text-sm text-black dark:text-white`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }}
          onMouseEnter={() => onMouseOver(index)}
        >
          {prompt.name}
        </li>
      ))}
    </ul>
  );
};