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
        className={`w-full flex-1 rounded-md border border-black/30 px-4 py-3 pr-10 text-[14px] leading-3  text-black dark:text-white ${lightMode === 'red' ? 'bg-[#FFC7C7]' : lightMode === 'blue' ? 'bg-[#A6E3E9]' : lightMode === 'green' ? 'bg-[#61C0BF]' : 'bg-[#FFFBE9] dark:bg-black'}`}
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
