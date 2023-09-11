import {
  FC,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/api/home/home.context';
import { homedir } from 'os';

interface Props {
  prompt: Prompt;
  onClose: () => void;
  onUpdatePrompt: (prompt: Prompt) => void;
}

// 定义一个名为 PromptModal 的函数组件，用于展示一个提示模态框。
// onUpdatePrompt 是更新提示内容的回调函数。
export const PromptModal: FC<Props> = ({ prompt, onClose, onUpdatePrompt }) => {
  const {
    state: { activePromptID },
  
    dispatch: homeDispatch,
  } = useContext(HomeContext);
  
  const { t } = useTranslation('promptbar');
  // 使用 useState 钩子来定义了四个状态
  const [name, setName] = useState(prompt.name);
  const [description, setDescription] = useState(prompt.description);
  const [content, setContent] = useState(prompt.content);

  // 使用 useRef 钩子定义了两个引用
  // nameInputRef 是对输入框的引用，modalRef 是对模态框的引用。
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const {
    state: { lightMode },
  } = useContext(HomeContext);

  // 按下 Enter 键时更新提示的内容并关闭模态框
  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onUpdatePrompt({ ...prompt, name, description, content: content.trim() });
      onClose();
    }
  };

  // 实现点击模态框外部区域关闭模态框的功能
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

  // 在模态框打开时自动将焦点设置到输入框，以便用户可以直接进行编辑操作。
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // 模态框组件的渲染逻辑
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onKeyDown={handleEnter}
    >
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className={`dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all ${
              lightMode === 'red'
                ? 'bg-[#F2ECBE]'
                : lightMode === 'blue'
                ? 'bg-[#F6F4EB]'
                : lightMode === 'green'
                ? 'bg-[#FAF1E4]'
                : lightMode === 'purple'
                ? 'bg-[#C5DFF8]'
                : lightMode === 'brown'
                ? 'bg-[#F4EEE0]'
                : lightMode === 'BISTU' 
                ? 'bg-[#eef5fd]' 
                : 'bg-[#F6F6F6] dark:bg-[#343541]'
            } sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle`}
            role="dialog"
          >
            <div className="text-sm font-bold text-black dark:text-neutral-200">
              {t('Name')}
            </div>
            <input
              ref={nameInputRef}
              className={`mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 ${
                lightMode === 'red'
                  ? 'bg-[#F2ECBE]'
                  : lightMode === 'blue'
                  ? 'bg-[#F6F4EB]'
                  : lightMode === 'green'
                  ? 'bg-[#FAF1E4]'
                  : lightMode === 'purple'
                  ? 'bg-[#C5DFF8]'
                  : lightMode === 'brown'
                  ? 'bg-[#F4EEE0]'
                  : lightMode === 'BISTU' 
                  ? 'bg-[#eef5fd]' 
                  : 'bg-[#F6F6F6] dark:bg-[#343541]'
              } dark:text-neutral-100`}
              placeholder={t('A name for your prompt.') || ''}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
              {t('Description')}
            </div>
            <textarea
              className={`mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 ${
                lightMode === 'red'
                  ? 'bg-[#F2ECBE]'
                  : lightMode === 'blue'
                  ? 'bg-[#F6F4EB]'
                  : lightMode === 'green'
                  ? 'bg-[#FAF1E4]'
                  : lightMode === 'purple'
                  ? 'bg-[#C5DFF8]'
                  : lightMode === 'brown'
                  ? 'bg-[#F4EEE0]'
                  : lightMode === 'BISTU' 
                  ? 'bg-[#eef5fd]' 
                  : 'bg-[#F6F6F6] dark:bg-[#343541]'
              } dark:text-neutral-100`}
              style={{ resize: 'none' }}
              placeholder={t('A description for your prompt.') || ''}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
              {t('Prompt')}
            </div>
            <textarea
              className={`mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 ${
                lightMode === 'red'
                  ? 'bg-[#F2ECBE]'
                  : lightMode === 'blue'
                  ? 'bg-[#F6F4EB]'
                  : lightMode === 'green'
                  ? 'bg-[#FAF1E4]'
                  : lightMode === 'purple'
                  ? 'bg-[#C5DFF8]'
                  : lightMode === 'brown'
                  ? 'bg-[#F4EEE0]'
                  : lightMode === 'BISTU' 
                  ? 'bg-[#eef5fd]' 
                  : 'bg-[#F6F6F6] dark:bg-[#343541]'
              } dark:text-neutral-100`}
              style={{ resize: 'none' }}
              placeholder={
                t(
                  'Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}',
                ) || ''
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />

            <div className="flex space-x-4">
              <button
                type="button"
                className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                onClick={() => {
                  const updatedPrompt = {
                    ...prompt,
                    name,
                    description,
                    content: content.trim(),
                  };

                  onUpdatePrompt(updatedPrompt);
                  onClose();
                }}
              >
                {t('Save')}
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                onClick={() => {
                  // 保存
                  const updatedPrompt = {
                    ...prompt,
                    name,
                    description,
                    content: content.trim(),
                  };

                  onUpdatePrompt(updatedPrompt);
                  // 使用
                  homeDispatch({ field: 'activePromptID', value: prompt.id })
                  onClose();
                }}
              >
                {'保存并使用'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
