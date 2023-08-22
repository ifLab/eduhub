import { FC } from 'react';

import { Prompt } from '@/types/prompt';

import { PromptComponent } from './Prompt';

interface Props {
  prompts: Prompt[];
}

// 定义了一个名为 Prompts 的函数组件，它接受一个名为 prompts 的属性，该属性是一个包含提示对象的数组。
export const Prompts: FC<Props> = ({ prompts }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {prompts
        // 使用 .slice() 方法创建一个数组的副本，然后使用 .reverse() 方法将其反转
        .slice()
        .reverse()
        // 使用 .map() 方法遍历数组，将每个元素渲染为一个 PromptComponent 组件
        .map((prompt, index) => (
          // 在 <PromptComponent> 组件中，通过 key={index} 设置每个组件的唯一标识，
          // 并通过 prompt={prompt} 属性传递每个提示对象的数据。
          <PromptComponent key={index} prompt={prompt} />
        ))}
    </div>
  );
};
