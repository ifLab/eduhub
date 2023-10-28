import { FC, useContext, useEffect, useReducer, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import HomeContext from '@/pages/api/home/home.context';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const HelpDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('Help');

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
            className={`dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all ${lightMode === 'red' ? 'bg-[#F2ECBE]' : lightMode === 'blue' ? 'bg-[#F6F4EB]' : lightMode === 'green' ? 'bg-[#FAF1E4]' : lightMode === 'purple' ? 'bg-[#C5DFF8]' : lightMode === 'brown' ? 'bg-[#F4EEE0]'  : lightMode === 'BISTU' ? 'bg-[#eef5fd]' :'bg-[#F6F6F6] dark:bg-[#343541]'} sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle`}
            role="dialog"
          >
            {/* <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {('帮助')}
            </div> */}

            <div className="text-sm mb-2 text-black dark:text-neutral-200" style={{ lineHeight: '2' }}>
            <p className="mb-4">{'大语言模型是人工智能的一个重要分支,它通过学习和分析大量文本数据,来理解人类语言并生成类似人类的语言。大语言模型可以自动完成各种语言任务,比如自动写作、翻译、对话等。其核心思想是让计算机像人类一样,通过学习语料库来获取语言能力。'}</p>
            <p className="mb-4">{'AIGC 是“Artificially Intelligent Generated Content”的缩写，意为“人工智能生成的内容”。这是指通过人工智能技术，特别是大型语言模型，自动生成的文本、图像、音频或视频内容。例如，一些新闻机构使用AI来自动生成新闻报道，而设计师可能使用AI工具来创建图像或设计。'}</p>
            <p className="mb-4">{'提示词是在向语言模型提问或让其完成任务时,提供的额外线索词语。提示工程（PE）是与 AI 进行有效沟通以实现预期结果的过程。'}</p>
            <p className="mb-4">{'本应用基于以下大模型构建'}</p>
            <ul className="mb-4">
              <li><a href="https://chatglm.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">智谱清言</a></li>
              <li><a href="https://yiyan.baidu.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">百度文心一言</a></li>
              <li><a href="https://qianwen.aliyun.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">阿里通义千问</a></li>
            </ul>
            <p className="mb-4">{'参考链接'}</p>
            <ul className="mb-4">
              <li><a href="https://www.edu.cn/info/focus/zctp/202308/t20230804_2455772.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">《2023地平线报告》：人工智能为高等教育带来何种机遇和挑战？</a></li>
              <li><a href="https://www.edu.cn/info/ji_shu_ju_le_bu/rgzn/202308/t20230809_2456263.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">智慧校园建设：人工智能的赋能与变革</a></li>
              <li><a href="https://www.edu.cn/info/focus/li_lun_yj/202309/t20230925_2498033.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">教育中的人工智能应简约不减效</a></li>
              <li><a href="https://www.edu.cn/info/focus/li_lun_yj/202307/t20230725_2454291.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">面对ChatGPT学校教育的变与不变</a></li>
              <li><a href="https://www.edu.cn/info/xy/xytp/202308/t20230825_2458144.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">人工智能将为智慧校园创造何种可能?</a></li>
              <li><a href="https://www.bilibili.com/video/BV16g4y1F7dN/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">提示词工程进阶教学</a></li>
              <li><a href="https://www.bilibili.com/video/BV1sm4y1x789/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">沃顿商学院 面向教学实用的人工智能</a></li>
            </ul>
            </div>

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