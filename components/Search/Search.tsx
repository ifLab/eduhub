import { IconX } from '@tabler/icons-react';
import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';
import { useContext } from 'react';

interface Props {
  placeholder: string;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}
const Search: FC<Props> = ({ placeholder, searchTerm, onSearch }) => {
  const { t } = useTranslation('sidebar');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const {
    state: { lightMode },} = useContext(HomeContext);

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className="relative flex items-center">
      <input
      // 搜索框 样式设置（背景色、边框）
        className={`w-full flex-1 rounded-md border border-white/20 px-4 py-3 pr-10 text-[14px] leading-3 text-white ${lightMode === 'red' ? 'bg-[#9A3B3B]' : lightMode === 'blue' ? 'bg-[#4682A9]' : lightMode === 'green' ? 'bg-[#435334]' : lightMode === 'purple' ? 'bg-[#4A55A2]' : lightMode === 'brown' ? 'bg-[#393646]'  :'bg-[#687084] dark:bg-[#202123]'}`}
        type="text"
        placeholder={t(placeholder) || ''}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm && (
        <IconX
          className="absolute right-4 cursor-pointer text-neutral-300 hover:text-neutral-400"
          size={18}
          onClick={clearSearch}
        />
      )}
    </div>
  );
};

export default Search;
