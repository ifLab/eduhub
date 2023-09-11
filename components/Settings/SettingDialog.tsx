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

export const SettingDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('settings');
  // 通过getSettings函数获取与设置相关的配置信息，并将其赋值给settings变量。
  const settings: Settings = getSettings();
  // 使用useCreateReducer自定义钩子函数，创建了一个可管理Settings类型状态的state和dispatch。
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });
  // 使用useContext钩子函数获取到HomeContext上下文，并将其中的dispatch赋值给homeDispatch变量。
  const { state: { lightMode },
    dispatch: homeDispatch 
  } = useContext(HomeContext);

  // 使用useRef钩子函数创建了一个引用modalRef，该引用指向一个HTMLDivElement元素。
  const modalRef = useRef<HTMLDivElement>(null);

  // 通过鼠标事件监听器实现了在用户点击对话框外部区域时关闭对话框的功能，
  // 并且在组件卸载时清除了相关的事件监听器，以避免内存泄漏。
  // 使用useEffect钩子函数来注册鼠标事件监听器，并在组件卸载时取消事件监听。
  useEffect(() => {
    // 定义handleMouseDown函数来处理鼠标按下事件。
    const handleMouseDown = (e: MouseEvent) => {
      // 通过检查modalRef.current是否存在且鼠标点击的目标不在对话框内（即鼠标点击了对话框外部），
      // 来确定用户是否希望关闭对话框。如果需要关闭对话框，则注册handleMouseUp函数作为mouseup事件的处理函数。
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // 移除mouseup事件监听器，然后调用onClose函数来关闭对话框。
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    // 将handleMouseDown函数注册为mousedown事件的处理函数，以便捕获鼠标按下事件。
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      // 在组件卸载时调用该函数，移除mousedown事件监听器。
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);
  
  // 保存设置并更新主题
  const handleSave = () => {
    homeDispatch({ field: 'lightMode', value: state.theme });
    saveSettings(state);

    console.log(state.theme); // 输出state.theme的值

    onClose();
  };

  const handleClearCache = (clearCache: boolean) => {
    if (clearCache) {
      // 清除该页面的缓存
      sessionStorage.clear();
      localStorage.clear();
      alert(t('清除缓存成功'));
    }
    onClose();
  };
  // Render nothing if the dialog is not open.
  // 在对话框未打开时不渲染任何内容。
  if (!open) {
    return <></>;
  }

  // Render the dialog.
  // 渲染对话框  呈现一个位于屏幕中心的对话框，其中包含一个下拉列表和一个保存按钮。
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
            className={`dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all ${lightMode === 'red' ? 'bg-[#F2ECBE]' : lightMode === 'blue' ? 'bg-[#F6F4EB]' : lightMode === 'green' ? 'bg-[#FAF1E4]' : lightMode === 'purple' ? 'bg-[#C5DFF8]' : lightMode === 'brown' ? 'bg-[#F4EEE0]'  : lightMode === 'BISTU' ? 'bg-[#eef5fd]' :'bg-[#F6F6F6] dark:bg-[#343541]'} sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle`}
            role="dialog"
          >
            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('Settings')}
            </div>

            <a
              type="button"
              className="mb-5 cursor-pointer text-neutral-700 dark:text-neutral-200"
              onClick={() => handleClearCache(true)}
            >
              {t('清除缓存')}
            </a>

            <div className="mb-5 bg-neutral-500 border-neutral-500 h-0.5">
              <hr/>
            </div>
            
            <div className="text-sm font-bold mb-2 text-black dark:text-neutral-200">
              {t('Theme')}
            </div>

            <select
              className="w-full cursor-pointer bg-transparent p-2 text-neutral-700 dark:text-neutral-200"
              value={state.theme}
              onChange={(event) =>
                dispatch({ field: 'theme', value: event.target.value })
              }
            >
              <option value="dark">{t('Dark mode')}</option>
              <option value="light">{t('Light mode')}</option>

              <option value="red">{t('红色模式')}</option>
              <option value="blue">{t('蓝色模式')}</option>
              <option value="green">{t('绿色模式')}</option>
              <option value="purple">{t('紫色模式')}</option>
              <option value="brown">{t('褐色模式')}</option>
              <option value="BISTU">{t('BISTU')}</option>
            </select>


            <button
              type="button"
              className="w-full px-4 py-2 mt-6 ml-2 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={handleSave}
            >
              {t('保存')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
