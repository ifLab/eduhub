import { useRouter } from 'next/router';

interface Props {
  content: string;
  showButton: boolean;
}

export default function LoginNotice(props: Props) {
  const router = useRouter();

  const handleSave = () => {
    router.push(
      'https://ids.bistu.edu.cn/oauth/authorize?client_id=6039hD163z83mJs6&response_type=code',
    );
  };

  // 在对话框未打开时不渲染任何内容。

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:w-2/3 md:w-1/3 flex flex-col">
        <div className="flex-grow">
          <div className="text-2xl font-semibold mb-4">登录提示</div>
          <div className="text-base mb-6">{props.content}</div>
        </div>
        {props.showButton && (
          <div className="self-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              去登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}