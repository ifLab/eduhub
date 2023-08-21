import { IconFileExport, IconSettings, IconUsers, IconUser, IconWorldUpload, IconFileDescription, IconMathFunction, IconSchool, IconApps,IconCertificate,IconBrandMessenger } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';
import { TeacherDialog } from '@/components/Settings/TeacherDialog';
import { StudentDialog } from '@/components/Settings/StudentDialog';
import { SearchDialog } from '@/components/Settings/SearchDialog';
import { PaperDialog } from '@/components/Settings/PaperDialog';
import { CalculateDialog } from '@/components/Settings/CalculateDialog';
import { TechnologyDialog } from '@/components/Settings/TechnologyDialog';

import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);
  const [isTeacherDialogOpen, setIsTeacherDialog] = useState<boolean>(false);
  const [isStudentDialogOpen, setIsStudentDialog] = useState<boolean>(false);
  const [isSearchDialogOpen, setIsSearchDialog] = useState<boolean>(false);
  const [isPaperDialogOpen, setIsPaperDialog] = useState<boolean>(false);
  const [isCalculateDialogOpen, setIsCalculateDialog] = useState<boolean>(false);
  const [isTechnologyDialogOpen, setIsTechnologyDialog] = useState<boolean>(false);

  const [isCampusAssistantVisible, setIsCampusAssistantVisible] = useState(false);
  const [isShowSubButtons, setShowSubButtons] = useState(false);
  const [isShowTechnologyButton, setShowTechnologyButton] = useState(false);


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
    // handleTeachingAssistant,
  } = useContext(ChatbarContext);

  const handleToggleCampusAssistant = () => {
    setIsCampusAssistantVisible(!isCampusAssistantVisible);
  };

  const handleToggleShowSubButtons = () => {
    setShowSubButtons(!isShowSubButtons);
  };

  const handleToggleShowTechnologyButton = () => {
    setShowTechnologyButton(!isShowTechnologyButton);
  };

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

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

      {/* 校园助理按钮渲染 */}
      <SidebarButton
        text={t('校园助理')}
        icon={<IconSchool size={18} />}
        onClick={handleToggleCampusAssistant}
      />

      {isCampusAssistantVisible && (
        <>
          <div>
            {/* 教师助理按钮渲染 */}
            <SidebarButton
              text={t('教师助理')}
              icon={<IconUsers size={18} />}
              onClick={() => setIsTeacherDialog(true)}
            />
          </div>
          <div>
            {/* 学生助理按钮渲染 */}
            <SidebarButton
              text={t('学生助理')}
              icon={<IconUser size={18} />}
              onClick={() => setIsStudentDialog(true)}
            />
          </div>
        </>
      )}

      {/* 智能插件按钮 */}
      <SidebarButton
        text={t('智能插件')}
        icon={<IconApps size={18} />}
        onClick={handleToggleShowSubButtons}
      />

      {/* 显示三个子按钮 */}
      {isShowSubButtons && (    
        <>
          <div className="ml-2">
            {/* 联网搜索按钮 */}
            <SidebarButton
              text={t('联网搜索')}
              icon={<IconWorldUpload size={18} />}
              onClick={() => setIsSearchDialog(true)}
            />
          </div>
          <div className="ml-2">
            {/* 论文检索按钮 */}
            <SidebarButton
              text={t('论文检索')}
              icon={<IconFileDescription size={18} />}
              onClick={() => setIsPaperDialog(true)}
            />
          </div>
          <div className="ml-2">
            {/* 数学计算按钮 */}
            <SidebarButton
              text={t('数学计算')}
              icon={<IconMathFunction size={18} />}
              onClick={() => setIsCalculateDialog(true)}
            />
          </div>
        </>
      )}

      {/* 课程助手按钮 */}
      <SidebarButton
        text={t('课程助手')}
        icon={<IconCertificate size={18} />}
        onClick={handleToggleShowTechnologyButton}
      />

      {/* 显示“开源软件开发技术”按钮 */}
      {isShowTechnologyButton && (
        <div className="ml-2">
          {/* 开源软件开发技术按钮 */}
          <SidebarButton
            text={t('开源软件开发技术')}
            icon={<IconBrandMessenger size={18} />}
            onClick={() => setIsTechnologyDialog(true)}
          />
        </div>
      )}

      {/* {!serverSideApiKeyIsSet ? (
        <Key apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      ) : null}

      {!serverSidePluginKeysSet ? <PluginKeys /> : null} */}

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
   
      <TeacherDialog
        open={isTeacherDialogOpen}
        onClose={() => {
          setIsTeacherDialog(false);
        }}
      />      
      <StudentDialog
        open={isStudentDialogOpen}
        onClose={() => {
          setIsStudentDialog(false);
        }}
      />   
      <SearchDialog
        open={isSearchDialogOpen}
        onClose={() => {
          setIsSearchDialog(false);
        }}
      />       
      <PaperDialog
        open={isPaperDialogOpen}
        onClose={() => {
          setIsPaperDialog(false);
        }}
      />       
      <CalculateDialog
        open={isCalculateDialogOpen}
        onClose={() => {
          setIsCalculateDialog(false);
        }}
      />    
      <TechnologyDialog
        open={isTechnologyDialogOpen}
        onClose={() => {
          setIsTechnologyDialog(false);
        }}
      />          
    </div>
  );
};
