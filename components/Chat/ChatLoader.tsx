import { IconRobot } from '@tabler/icons-react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot,faCircleUser,faAtom } from '@fortawesome/free-solid-svg-icons';
import { FC, useContext  } from 'react';
import HomeContext from '@/pages/api/home/home.context';

interface Props { }

export const ChatLoader: FC<Props> = () => {
  const { state: { lightMode } } = useContext(HomeContext);
  return (
    <div
      className={`group border-b border-black/10 text-gray-800 dark:border-gray-900/50 dark:text-gray-100 ${lightMode === 'red' ? 'bg-[#F2ECBE]' : lightMode === 'blue' ? 'bg-[#F6F4EB]' : lightMode === 'green' ? 'bg-[#FAF1E4]' : lightMode === 'purple' ? 'bg-[#C5DFF8]' : lightMode === 'brown' ? 'bg-[#F4EEE0]' :'bg-[#F6F6F6] dark:bg-[#343541]'}`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] items-end">
          <FontAwesomeIcon icon={faAtom}  style={{ height: '25px', width: '25px' }} fixedWidth />
        </div>
        <span className="animate-pulse cursor-default mt-1">▍</span>
      </div>
    </div>
  );
};
