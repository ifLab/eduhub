import { FC } from 'react';

interface Props {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SidebarButton: FC<Props> = ({ text, icon, onClick }) => {
  return (
    // 左侧边栏 左下按钮的样式设置(白色字体...)
    <button
      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={onClick}
    >
      <div>{icon}</div>
      <span>{text}</span>
    </button>
  );
};
