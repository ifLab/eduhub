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

export const LogoDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('BISTU');
//   const settings: Settings = getSettings();
//   const { state, dispatch } = useCreateReducer<Settings>({
//     initialState: settings,
//   });
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

  const handleSave = () => {
    // homeDispatch({ field: 'lightMode', value: state.theme });
    // saveSettings(state);
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
              {t('校园智能助理 BistuCopilot')}
            </div>

            <div className="text-sm mb-2 text-black dark:text-neutral-200" style={{ lineHeight: '2' }}>
              {t('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0校园智能助理（BistuCopilot）由信息网络中心和计算机学院联合开发，系统使用国产信创开源大语言模型作为基础，将学校各部门的公开信息，如办事指南、规章制度等数据嵌入到系统中，以问答的方式帮助校园用户查找和获取校园内部的知识和信息资源，并能实现对信息内容进行总结、润色、翻译等功能，为师生提供个性化的信息服务。除此以外，系统还可以通过语意理解用户需求，自动调用联网搜索、论文搜索、数学计算等插件，扩展大语言模型的能力。')}
              <br />
              <br />
              {t('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0项目团队：周翌旭，孙达，王肄文，李若妍，吕正日')}
            </div>

            {/* <select
              className="w-full cursor-pointer bg-transparent p-2 text-neutral-700 dark:text-neutral-200"
              value={state.theme}
              onChange={(event) =>
                dispatch({ field: 'theme', value: event.target.value })
              }
            >
              <option value="dark">{t('Dark mode')}</option>
              <option value="light">{t('Light mode')}</option>
            </select> */}

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                handleSave();
                onClose();
              }}
            >
              {t('关闭')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};