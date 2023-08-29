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
        className={`w-full flex-1 rounded-md border border-black/30 px-4 py-3 pr-10 text-[14px] leading-3  text-black dark:text-white ${lightMode === 'red' ? 'bg-[#F2ECBE]' : lightMode === 'blue' ? 'bg-[#F6F4EB]' : lightMode === 'green' ? 'bg-[#FAF1E4]' : lightMode === 'purple' ? 'bg-[#C5DFF8]' : lightMode === 'brown' ? 'bg-[#F4EEE0]' :'bg-[#F6F6F6] dark:bg-[#343541]'}`}
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
