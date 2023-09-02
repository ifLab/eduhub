import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { savePrompts } from '@/utils/app/prompts';

import { OpenAIModels } from '@/types/openai';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/api/home/home.context';

import { PromptFolders } from './components/PromptFolders';
import { PromptbarSettings } from './components/PromptbarSettings';
import { Prompts } from './components/Prompts';

import Sidebar from '../Sidebar';
import PromptbarContext from './PromptBar.context';
import { PromptbarInitialState, initialState } from './Promptbar.state';

import { v4 as uuidv4 } from 'uuid';

const Promptbar = () => {
  const { t } = useTranslation('promptbar');

  // 通过 useCreateReducer 自定义钩子，创建了 promptBarContextValue 上下文值。
  const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
    // 使用初始状态 initialState 来初始化 Promptbar 的上下文。
    initialState,
  });

  // 利用 useContext 钩子从 HomeContext 上下文中获取了一些状态和函数。
  // prompts（提示列表），defaultModelId（默认模型ID），showPromptbar（是否显示提示栏），
  // homeDispatch（状态更新函数），以及 handleCreateFolder（创建文件夹的函数）
  const {
    state: { prompts, defaultModelId, showPromptbar },
    dispatch: homeDispatch,
    handleCreateFolder,
  } = useContext(HomeContext);

  // 使用解构赋值从 promptBarContextValue 上下文值中提取了 
  // searchTerm（搜索关键词）和 filteredPrompts（过滤后的提示列表），以及 promptDispatch（状态更新函数）
  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  // handleTogglePromptbar 用于切换提示栏的可见性。
  const handleTogglePromptbar = () => {
    // 使用 homeDispatch 函数来更新 showPromptbar 状态的值，通过逻辑非操作符 ! 对其进行取反。
    homeDispatch({ field: 'showPromptbar', value: !showPromptbar });
    // 使用 localStorage.setItem() 将更新后的值以 JSON 字符串的形式存储在本地存储中，键名为 showPromptbar
    localStorage.setItem('showPromptbar', JSON.stringify(!showPromptbar));
  };

  // 创建一个新的提示
  // (内容添加至 点击“新建提示”按钮后，出现的Prompt对话框中；不是页面初始化的Prompt对话框)
  const handleCreatePrompt = () => {
    if (defaultModelId) {
      // 如果 defaultModelId 存在，则创建一个新的提示对象 newPrompt。
      // 该提示对象包含了一个唯一的 id（使用 uuidv4 生成），以及一些默认的属性值，如名称、描述、内容、模型和文件夹ID。
      const newPrompt: Prompt = {
        id: uuidv4(),
        name: `Prompt ${prompts.length + 1}`,
        description: '',
        content: '',
        model: OpenAIModels[defaultModelId],
        folderId: null,
      };     
      // 将新的提示对象添加到现有的 prompts 数组中，得到更新后的 updatedPrompts 数组。
      const updatedPrompts = [...prompts, newPrompt];
      // 通过 homeDispatch 函数将更新后的 updatedPrompts 数组保存到 home 上下文中的 prompts 字段中。
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      // 通过调用 savePrompts 函数保存更新后的 updatedPrompts 数组。
      savePrompts(updatedPrompts);
    }
  };

  // 删除一个提示
  const handleDeletePrompt = (prompt: Prompt) => {
    const updatedPrompts = prompts.filter((p) => p.id !== prompt.id);

    homeDispatch({ field: 'prompts', value: updatedPrompts });
    savePrompts(updatedPrompts);
  };
  // 更新提示
  const handleUpdatePrompt = (prompt: Prompt) => {
    const updatedPrompts = prompts.map((p) => {
      if (p.id === prompt.id) {
        return prompt;
      }

      return p;
    });
    homeDispatch({ field: 'prompts', value: updatedPrompts });

    savePrompts(updatedPrompts);
  };
  // 处理拖放操作
  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };

      handleUpdatePrompt(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  // 使用 React 的 useEffect 钩子函数，用于在组件渲染时监听 searchTerm 和 prompts 的变化。
  // 根据用户输入的搜索关键词对一组提示进行过滤，并将过滤结果存储在 filteredPrompts 字段中，以便后续使用。
  // useEffect(() => {

  //   if (searchTerm) {
  //     promptDispatch({
  //       field: 'filteredPrompts',
  //       value: prompts.filter((prompt) => {
  //         const searchable =
  //           prompt.name.toLowerCase() +
  //           ' ' +
  //           prompt.description.toLowerCase() +
  //           ' ' +
  //           prompt.content.toLowerCase();
  //         return searchable.includes(searchTerm.toLowerCase());
  //       }),
  //     });
  //   } else {
  //     promptDispatch({ field: 'filteredPrompts', value: prompts });
  //   }
  // }, [searchTerm, prompts]);

  useEffect(() => {
    // 页面初始化时创建两个默认的提示对象，分别对应两个默认的模型。
    // 通过 homeDispatch 函数将这两个提示对象保存到 home 上下文中的 prompts 字段中。
    if (prompts.length === 0) {
      const defaultPrompts = [
        {
          id: uuidv4(),
          name: '辅助医生',
          description: '扮演一名人工智能辅助医生',
          content: '我想让你扮演一名人工智能辅助医生。 我将为您提供患者的详细信息，您的任务是使用最新的人工智能工具，例如医学成像软件和其他机器学习程序，以诊断最可能导致其症状的原因。 您还应该将体检、实验室测试等传统方法纳入您的评估过程，以确保准确性。 我的第一个请求是:',
          model: OpenAIModels,
          folderId: null,
        },
        {
          id: uuidv4(),
          name: '学校讲师',
          description: '扮演讲师，向初学者教授算法。',
          content: '我想让你在学校扮演讲师，向初学者教授算法。 您将使用 Python 编程语言提供代码示例。 首先简单介绍一下什么是算法，然后继续给出简单的例子，包括冒泡排序和快速排序。 稍后，等待我提示其他问题。 一旦您解释并提供代码示例，我希望您尽可能将相应的可视化作为 ascii 艺术包括在内。',
          model: OpenAIModels,
          folderId: null,
        },
      ];
  
      homeDispatch({ field: 'prompts', value: defaultPrompts });
    }
  
    // 根据搜索关键词对提示进行过滤
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
  }, [searchTerm, prompts]);




  return (
    <PromptbarContext.Provider
      value={{
        ...promptBarContextValue,
        handleCreatePrompt,
        handleDeletePrompt,
        handleUpdatePrompt,
      }}
    >
      <Sidebar<Prompt>
        side={'right'}
        // 控制侧边栏的显示和隐藏
        isOpen={showPromptbar}
        // 设置了一个标题，用于显示在添加项按钮上。
        addItemButtonTitle={t('New prompt')}
        itemComponent={
          // 指定了一个 Prompts 组件作为主要的子组件，用于显示提示列表。
          <Prompts
            // 传递了一些参数给 Prompts 组件，包括提示列表、搜索关键词、以及一些状态更新函数。
            // prompts 属性是通过过滤得到的 filteredPrompts 数组中的非文件夹提示元素。
            prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
          />
        }
        // 指定了一个 PromptFolders 组件作为附加的子组件。
        folderComponent={<PromptFolders />}
        // items 属性设置为 filteredPrompts 数组，用于在侧边栏中显示的项。
        items={filteredPrompts}
        // searchTerm 属性传递了当前的搜索条件。
        searchTerm={searchTerm}
        // handleSearchTerm 属性是一个函数，用于更新搜索条件。
        handleSearchTerm={(searchTerm: string) =>
          promptDispatch({ field: 'searchTerm', value: searchTerm })
        }
        // toggleOpen 属性是一个函数，用于切换侧边栏的显示和隐藏状态。
        toggleOpen={handleTogglePromptbar}
        // 创建新的提示项
        handleCreateItem={handleCreatePrompt}
        // 创建新的文件夹
        handleCreateFolder={() => handleCreateFolder(t('New folder'), 'prompt',false)}
        // 处理拖放操作
        handleDrop={handleDrop}
      />
    </PromptbarContext.Provider>
  );
};

export default Promptbar;
