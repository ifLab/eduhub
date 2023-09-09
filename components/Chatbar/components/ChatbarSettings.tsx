import { IconFileExport, IconSettings, IconTrash } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { LogoDialog } from '@/components/Settings/LogoDialog';
import { ClearCacheDialog } from '@/components/Settings/ClearCacheDialog';

import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);

  const [isLogoDialogOpen, setIsLogoDialog] = useState<boolean>(false);
  const [isClearCacheDialogOpen, setIsClearCacheDialog] = useState<boolean>(false);

  const {
    state: {
      apiKey,
      lightMode,
      serverSideApiKeyIsSet,
      serverSidePluginKeysSet,
      conversations,
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);


  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {/* {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null} */}

      <Import onImport={handleImportConversations} />

      {/* <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData()}
      /> */}

      <SidebarButton
        text={t('Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />

      {/* <SidebarButton
        text={t('清除缓存')}
        icon={<IconTrash size={18} />}
        onClick={() => setIsClearCacheDialog(true)}
      /> */}

      {!serverSideApiKeyIsSet ? (
        <Key apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      ) : null}

      {!serverSidePluginKeysSet ? <PluginKeys /> : null}

      {/* 左下logo按钮 */}
      <SidebarButton
        text={t('')}
        icon={<img src="bistu.png" alt="Logo" style={{ height: '27px', width: '130px' }} />}
        onClick={() => setIsLogoDialog(true)}
      />
      {/* <SidebarButton
        text={t('BISTU Copilot')}
        icon={<img src="bistu-logo-440.ico" alt="Logo" style={{ height: '16px', width: '16px' }} />}
        onClick={() => setIsLogoDialog(true)}
      /> */}

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
      <ClearCacheDialog
        open={isClearCacheDialogOpen}
        onClose={() => {
          setIsClearCacheDialog(false);
        }}
      />
      <LogoDialog
        open={isLogoDialogOpen}
        onClose={() => {
          setIsLogoDialog(false);
        }}
      />
    </div>
  );
};
