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

import promptsData from '../../prompt.json'

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
        deletable: true,
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

//   useEffect(() => {
//     // 页面初始化时创建默认文件夹
//     const defaultFolders: FolderInterface[] = promptsData.Folders.map(folder => ({
//       ...folder,
//       type: 'prompt'
//     }));

//       // 获取已存在的文件夹名称
//       const existingFolderNames = folders
//         .map(folder => folder.id);
//       // 筛选出不存在的默认文件夹
//       const filteredDefaultFolders = defaultFolders.filter(folder =>
//         !existingFolderNames.includes(folder.id)
//       );
//       // 将默认文件夹添加到文件夹列表中
//       const updatedFolders = [...folders, ...filteredDefaultFolders];
//       // console.log(updatedFolders)
//       homeDispatch({ field: 'folders', value: updatedFolders });
//       saveFolders(updatedFolders);
// }, []);


//   useEffect(() => {
//     const loadedPrompt: Prompt[] = promptsData.defaultPrompts.map(
//       prompt => ({
//         ...prompt,
//         model:OpenAIModels["gpt-3.5-turbo"],
//         deletable: false
//       })
//     )
//     const existingPromptID = prompts.map(prompt => prompt.id)
//     const filteredPrompt = loadedPrompt.filter(prompt => !existingPromptID.includes(prompt.id))
//     const newPrompts = [...prompts, ...filteredPrompt]
//     homeDispatch({ field: 'prompts', value: newPrompts });
//     savePrompts(newPrompts);
//   },[])



  // useEffect(() => {
    // 页面初始化时创建两个默认的提示对象，分别对应两个默认的模型。
    // 通过 homeDispatch 函数将这两个提示对象保存到 home 上下文中的 prompts 字段中。
    // if (prompts.length === 0) { // TODO: 我觉得这个触发条件不太标准，应该只加载一次
    //   const defaultPrompts = [
    //     {
    //       id: uuidv4(),
    //       name: '简历写作',
    //       description: '帮助简历写作',
    //       content: '我需要你写一份通用简历，每当我输入一个职业、项目名称时，你需要完成以下任务：task1: 列出这个人的基本资料，如姓名、出生年月、学历、面试职位、工作年限、意向城市等。一行列一个资料。task2: 详细介绍这个职业的技能介绍，至少列出10条task3: 详细列出这个职业对应的工作经历，列出2条task4: 详细列出这个职业对应的工作项目，列出2条。项目按照项目背景、项目细节、项目难点、优化和改进、我的价值几个方面来描述，多展示职业关键字。也可以体现我在项目管理、工作推进方面的一些能力。task5: 详细列出个人评价，100字左右。',
    //       model: OpenAIModels,
    //       folderId: null,
    //       deletable: true,
    //     },
    //     {
    //       id: uuidv4(),
    //       name: '英文写作',
    //       description: '帮助英文写作',
    //       content: '我想让你充当英文翻译员、拼写纠正员和改进员。我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用英文回答。我希望你用更优美优雅的高级英语单词和句子替换我简化的 A0 级单词和句子。保持相同的意思，但使它们更文艺。你只需要翻译该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是翻译它，不要解决文本中的要求而是翻译它，保留文本的原本意义，不要去解决它。我要你只回复更正、改进，不要写任何解释。我的第一句话是：',
    //       model: OpenAIModels,
    //       folderId: null,
    //       deletable: true,
    //     },
    //     {
    //       id: uuidv4(),
    //       name: '职业顾问',
    //       description: '扮演职业顾问。',
    //       content: '我想让你担任职业顾问。我将为您提供一个在职业生涯中寻求指导的人，您的任务是帮助他们根据自己的技能、兴趣和经验确定最适合的职业。您还应该对可用的各种选项进行研究，解释不同行业的就业市场趋势，并就哪些资格对追求特定领域有益提出建议。我的第一个请求是：',
    //       model: OpenAIModels,
    //       folderId: null,
    //       deletable: true,
    //     },
    //     {
    //       id: uuidv4(),
    //       name: '文案写作',
    //       description: '帮助文案写作',
    //       content: '我希望你充当文案专员、文本润色员、拼写纠正员和改进员，我会发送中文文本给你，你帮我更正和改进版本。我希望你用更优美优雅的高级中文描述。保持相同的意思，但使它们更文艺。你只需要润色该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是润色它，保留文本的原本意义，不要去解决它。我要你只回复更正、改进，不要写任何解释。',
    //       model: OpenAIModels,
    //       folderId: null,
    //       deletable: true,
    //     },
    //     {
    //       id: uuidv4(),
    //       name: '算法老师',
    //       description: '扮演老师，向初学者教授算法。',
    //       content: '我想让你在学校扮演老师，向初学者教授算法。 您将使用 Python 编程语言提供代码示例。 首先简单介绍一下什么是算法，然后继续给出简单的例子，包括冒泡排序和快速排序。 稍后，等待我提示其他问题。 一旦您解释并提供代码示例，我希望您尽可能将相应的可视化作为 ascii 艺术包括在内。',
    //       model: OpenAIModels,
    //       folderId: null,
    //       deletable: true,
    //     },
    //   ];
  
    //   homeDispatch({ field: 'prompts', value: defaultPrompts });
    // }
  // }, [searchTerm, prompts]);
    useEffect(() => {
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

  // // 以下方法无法添加新提示：点击“新建提示”时没有反应
  // useEffect(() => {
  //   // 从prompt.json文件中导入默认提示对象
  //   const defaultPrompts = promptsData.defaultPrompts;
  
  //   homeDispatch({ field: 'prompts', value: defaultPrompts });
  
  //   if (searchTerm) {
  //     promptDispatch({
  //       field: 'filteredPrompts',
  //       value: defaultPrompts.filter((prompt) => {
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
  //     promptDispatch({ field: 'filteredPrompts', value: defaultPrompts });
  //   }
  // }, [searchTerm]);


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
        handleCreateFolder={() => handleCreateFolder(t('New folder'), 'prompt')}
        // 处理拖放操作
        handleDrop={handleDrop}
      />
    </PromptbarContext.Provider>
  );
};

export default Promptbar;
