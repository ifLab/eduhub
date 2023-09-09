import { FC, useContext, useEffect, useReducer, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ClearCacheDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('清除缓存');
  const { state: { lightMode },
    dispatch: homeDispatch 
  } = useContext(HomeContext);
  const modalRef = useRef<HTMLDivElement>(null);

  // 通过鼠标事件监听器实现了在用户点击对话框外部区域时关闭对话框的功能
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const handleSave = (clearCache: boolean) => {
    if (clearCache) {
      // 清除该页面的缓存
      sessionStorage.clear();
      localStorage.clear();
      alert(t('清除缓存成功'));
    }
    onClose();
  };

  // 在对话框未打开时不渲染任何内容。
  if (!open) {
    return <></>;
  }

  // Render the dialog.
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className={`dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all ${lightMode === 'red' ? 'bg-[#F2ECBE]' : lightMode === 'blue' ? 'bg-[#F6F4EB]' : lightMode === 'green' ? 'bg-[#FAF1E4]' : lightMode === 'purple' ? 'bg-[#C5DFF8]' : lightMode === 'brown' ? 'bg-[#F4EEE0]' :'bg-[#F6F6F6] dark:bg-[#343541]'} sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle`}
            role="dialog"
          >
            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('清除缓存')}
            </div>

            <div className="text-sm mb-2 text-black dark:text-neutral-200" style={{ lineHeight: '2' }}>
              {t('是否清除缓存？')}
              <br />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="w-1/2 px-4 py-2 mt-6 mr-2 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                onClick={() => handleSave(true)}
              >
                {t('是')}
              </button>

              <button
                type="button"
                className="w-1/2 px-4 py-2 mt-6 ml-2 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                onClick={() => handleSave(false)}
              >
                {t('否')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};