import { IconRobot } from '@tabler/icons-react';
import { FC, useContext  } from 'react';
import HomeContext from '@/pages/api/home/home.context';

interface Props { }

export const ChatLoader: FC<Props> = () => {
  const { state: { lightMode } } = useContext(HomeContext);
  return (
    <div
      className={`group border-b border-black/10 text-gray-800 dark:border-gray-900/50 dark:text-gray-100 ${lightMode === 'red' ? 'bg-[#FBE8E7]' : lightMode === 'blue' ? 'bg-[#CBF1F5]' : lightMode === 'green' ? 'bg-[#99DDCC]' : 'bg-white dark:bg-[#343541]'}`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] items-end">
          <IconRobot size={30} />
        </div>
        <span className="animate-pulse cursor-default mt-1">▍</span>
      </div>
    </div>
  );
};
