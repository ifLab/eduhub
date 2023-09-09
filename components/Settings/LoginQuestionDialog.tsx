import { FC, useContext, useEffect, useReducer, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import HomeContext from '@/pages/api/home/home.context';
import { useRouter } from 'next/router';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LogoDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('是否登录');

  const { state: { lightMode },
    dispatch: homeDispatch 
  } = useContext(HomeContext);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 通过鼠标事件监听器实现了在用户点击对话框外部区域时关闭对话框的功能
//   useEffect(() => {
//     const handleMouseDown = (e: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
//         window.addEventListener('mouseup', handleMouseUp);
//       }
//     };

//     const handleMouseUp = (e: MouseEvent) => {
//       window.removeEventListener('mouseup', handleMouseUp);
//       onClose();
//     };

//     window.addEventListener('mousedown', handleMouseDown);

//     return () => {
//       window.removeEventListener('mousedown', handleMouseDown);
//     };
//   }, [onClose]);

  const handleSave = () => {
    router.push('https://ids.bistu.edu.cn/oauth/authorize?client_id=6039hD163z83mJs6&response_type=code');
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
              {t('登录提示')}
            </div>

            <div className="text-sm mb-2 text-black dark:text-neutral-200" style={{ lineHeight: '2' }}>
              {t('您还没有登录，是否进入登陆页面？')}
            </div>

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                handleSave();
                onClose();
              }}
            >
              {t('是')}
            </button>

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                onClose();
              }}
            >
              {t('否')}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};