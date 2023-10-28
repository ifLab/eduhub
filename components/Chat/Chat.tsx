import { IconClearAll, IconSettings } from '@tabler/icons-react';
import {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

import { useTranslation } from 'next-i18next';

import { getEndpoint } from '@/utils/app/api';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { throttle } from '@/utils/data/throttle';

import { ChatBody, Conversation, Message } from '@/types/chat';
import { Plugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import Spinner from '../Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { MemoizedChatMessage } from './MemoizedChatMessage';
import { ModelSelect } from './ModelSelect';
import { SystemPrompt } from './SystemPrompt';
import { TemperatureSlider } from './Temperature';

interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat = memo(({ stopConversationRef }: Props) => {
  const { t } = useTranslation('chat');

  const {
    state: {
      selectedConversation,
      conversations,
      models,
      apiKey,
      pluginKeys,
      serverSideApiKeyIsSet,
      messageIsStreaming,
      modelError,
      loading,
      prompts,
      user,
      lightMode,
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(
    async (message: Message, deleteCount = 0, plugin: Plugin | null = null) => {
      // 是否存在选定的会话
      if (selectedConversation) {
        let updatedConversation: Conversation;
        // 如果deleteCount大于0，则从当前会话的消息数组中删除最后deleteCount条消息，
        // 并创建一个新的更新后的会话对象updatedConversation，将新的消息添加到其中。
        if (deleteCount) {
          const updatedMessages = [...selectedConversation.messages];
          for (let i = 0; i < deleteCount; i++) {
            updatedMessages.pop();
          }
          updatedConversation = {
            ...selectedConversation,
            messages: [...updatedMessages, message],
          };
        } else {
          // 如果deleteCount等于0，则直接创建一个新的更新后的会话对象updatedConversation，
          // 将新的消息添加到当前会话的消息数组中。
          updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
          };
        }
        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
        homeDispatch({ field: 'loading', value: true });
        homeDispatch({ field: 'messageIsStreaming', value: true });
        const chatBody: ChatBody = {
          model: updatedConversation.model,
          messages: updatedConversation.messages,
          key: updatedConversation.model.key,
          prompt: updatedConversation.prompt,
          temperature: updatedConversation.temperature,
          conversationID: updatedConversation.conversationID,
          user: user,
        };
        const endpoint = getEndpoint(plugin);
        let body;
        if (!plugin) {
          body = JSON.stringify(chatBody);
        } else {
          body = JSON.stringify({
            ...chatBody,
            googleAPIKey: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
            googleCSEId: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
          });
        }
        const controller = new AbortController();
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body,
        });
        if (!response.ok) {
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          toast.error(response.statusText);
          return;
        }
        const data = response.body;
        if (!data) {
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          return;
        }
        if (!plugin) {
          if (updatedConversation.messages.length === 1) {
            // 获取消息对象的content属性，并根据内容长度进行定制化处理，将截取的内容作为会话的名称。
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
            // 通过扩展运算符将新的会话名称添加到updatedConversation对象中。
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }
          homeDispatch({ field: 'loading', value: false });
          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let isFirst = true;
          let accumulatedText = '';
          let text = '';
          while (!done) {
            if (stopConversationRef.current === true) {
              controller.abort();
              done = true;
              break;
            }
            const { value, done: doneReading } = await reader.read();
            done = doneReading;

            accumulatedText += decoder.decode(value);

            // 使用换行符（或其他分隔符）分割累积的文本，并处理每一个完整的 JSON 对象
            while (accumulatedText.includes('\n')) {
              const splitIndex = accumulatedText.indexOf('\n');
              const jsonText = accumulatedText.slice(0, splitIndex);

              const parsedMessage = JSON.parse(jsonText);
              const { answer: answer, conversation_id: newConversationId } =
                parsedMessage;
              console.log('answer', answer);

              const chunkValue = answer;
              if (chunkValue != undefined) {
                text += chunkValue;
              }
              // 第一次读取响应的数据块
              if (isFirst) {
                isFirst = false;
                // 创建一个新的消息数组updatedMessages，将当前会话（updatedConversation）原有的消息对象和一个新的消息对象添加进去。
                const updatedMessages: Message[] = [
                  ...updatedConversation.messages,
                  { role: 'assistant', content: chunkValue },
                ];
                // 更新updatedConversation对象，将新的消息数组updatedMessages赋值给messages字段。
                updatedConversation = {
                  ...updatedConversation,
                  messages: updatedMessages,
                };
                // 将更新后的updatedConversation对象派发给主页组件（Home），以更新选中的会话。
                homeDispatch({
                  field: 'selectedConversation',
                  value: updatedConversation,
                });
              } else {
                const updatedMessages: Message[] =
                  updatedConversation.messages.map((message, index) => {
                    if (index === updatedConversation.messages.length - 1) {
                      return {
                        ...message,
                        content: text,
                      };
                    }
                    return message;
                  });
                updatedConversation = {
                  ...updatedConversation,
                  messages: updatedMessages,
                };
                homeDispatch({
                  field: 'selectedConversation',
                  value: updatedConversation,
                });
              }
              accumulatedText = accumulatedText.slice(splitIndex + 1);

              // update conversation id
              if (newConversationId) {
                updatedConversation = {
                  ...updatedConversation,
                  conversationID: newConversationId,
                };
              }
            }
          }

          saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          // console.log('updatedConversations', updatedConversations);
          // Check if any conversation has "deletable" attribute set to true
          const deletableConversations = updatedConversations.filter(
            (conversation) => conversation.deletable === true,
          );

          // If there is no conversation with "deletable" attribute set to true, add updated conversation to the array
          if (
            !deletableConversations.length &&
            updatedConversation.deletable === true
          ) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          saveConversations(updatedConversations);
          homeDispatch({ field: 'messageIsStreaming', value: false });
        } else {
          const { answer } = await response.json();
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: 'assistant', content: answer },
          ];
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
          homeDispatch({
            field: 'selectedConversation',
            value: updateConversation,
          });
          saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          saveConversations(updatedConversations);
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
        }
      }
    },
    [
      apiKey,
      conversations,
      pluginKeys,
      selectedConversation,
      stopConversationRef,
    ],
  );

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const onClearAll = () => {
    if (
      confirm(t<string>('Are you sure you want to clear all messages?')) &&
      selectedConversation
    ) {
      handleUpdateConversation(selectedConversation, {
        key: 'messages',
        value: [],
      });
    }
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  // useEffect(() => {
  //   console.log('currentMessage', currentMessage);
  //   if (currentMessage) {
  //     handleSend(currentMessage);
  //     homeDispatch({ field: 'currentMessage', value: undefined });
  //   }
  // }, [currentMessage]);

  useEffect(() => {
    throttledScrollDown();
    selectedConversation &&
      setCurrentMessage(
        selectedConversation.messages[selectedConversation.messages.length - 2],
      );
  }, [selectedConversation, throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  return (
    <div
      className={`relative flex-1 overflow-hidden ${
        lightMode === 'red'
          ? 'bg-[#F2ECBE]'
          : lightMode === 'blue'
          ? 'bg-[#F6F4EB]'
          : lightMode === 'green'
          ? 'bg-[#FAF1E4]'
          : lightMode === 'purple'
          ? 'bg-[#C5DFF8]'
          : lightMode === 'brown'
          ? 'bg-[#F4EEE0]'
          : 'bg-[#F6F6F6] dark:bg-[#343541]'
      }`}
    >
      <>
        <div
          className="max-h-full overflow-x-hidden"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {selectedConversation?.messages.length === 0 ? (
            <>
              <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
                
                <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
                  <h3 style={{color: '#1a4687'}}>📘 <i>eduhub.chat</i></h3>
                  {/* <img
                    src="logo.png"
                    alt="logo"
                    className="mx-auto"
                    width="200px"
                    height="auto"
                  /> */}
                </div>

                {/* <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-600">
                      <ModelSelect />

                      <SystemPrompt
                        conversation={selectedConversation}
                        prompts={prompts}
                        onChangePrompt={(prompt) =>
                          handleUpdateConversation(selectedConversation, {
                            key: 'prompt',
                            value: prompt,
                          })
                        }
                      />

                      <TemperatureSlider
                        label={t('Temperature')}
                        onChangeTemperature={(temperature) =>
                          handleUpdateConversation(selectedConversation, {
                            key: 'temperature',
                            value: temperature,
                          })
                        }
                      />
                    </div> */}
              </div>
            </>
          ) : (
            <>
              {/* 顶部导航栏 */}
              <div
                className={`sticky top-0 z-10 flex justify-center border border-b-neutral-300 py-2 text-sm text-neutral-500 dark:border-none ${
                  lightMode === 'red'
                    ? 'bg-[#F2ECBE]'
                    : lightMode === 'blue'
                    ? 'bg-[#F6F4EB]'
                    : lightMode === 'green'
                    ? 'bg-[#FAF1E4]'
                    : lightMode === 'purple'
                    ? 'bg-[#C5DFF8]'
                    : lightMode === 'brown'
                    ? 'bg-[#F4EEE0]'
                    : 'bg-[#F6F6F6] dark:bg-[#343541]'
                } dark:text-neutral-200`}
              >
                {/* {t('Model')}: {selectedConversation?.model.name} | {t('Temp')}
                  : {selectedConversation?.temperature} | */}
                {/* <button
                    className="ml-2 cursor-pointer hover:opacity-50"
                    onClick={handleSettings}
                  >
                    <IconSettings size={18} />
                  </button> */}
                <button
                  className="ml-2 cursor-pointer hover:opacity-50"
                  onClick={onClearAll}
                >
                  <IconClearAll size={18} />
                </button>
              </div>
              {showSettings && (
                <div className="flex flex-col space-y-10 md:mx-auto md:max-w-xl md:gap-6 md:py-3 md:pt-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                  <div className="flex h-full flex-col space-y-4 border-b border-neutral-200 p-4 dark:border-neutral-600 md:rounded-lg md:border">
                    <ModelSelect />
                  </div>
                </div>
              )}

              {selectedConversation?.messages.map((message, index) => (
                <MemoizedChatMessage
                  key={index}
                  message={message}
                  messageIndex={index}
                  onEdit={(editedMessage) => {
                    setCurrentMessage(editedMessage);
                    // discard edited message and the ones that come after then resend
                    handleSend(
                      editedMessage,
                      selectedConversation?.messages.length - index,
                    );
                  }}
                />
              ))}

              {loading && <ChatLoader />}

              {/* 回复消息下方的空白区域 */}
              <div
                className={`h-[162px] ${
                  lightMode === 'red'
                    ? 'bg-[#F2ECBE]'
                    : lightMode === 'blue'
                    ? 'bg-[#F6F4EB]'
                    : lightMode === 'green'
                    ? 'bg-[#FAF1E4]'
                    : lightMode === 'purple'
                    ? 'bg-[#C5DFF8]'
                    : lightMode === 'brown'
                    ? 'bg-[#F4EEE0]'
                    : 'bg-[#F6F6F6] dark:bg-[#343541]'
                }`}
                ref={messagesEndRef}
              />
            </>
          )}
        </div>

        <ChatInput
          stopConversationRef={stopConversationRef}
          textareaRef={textareaRef}
          onSend={(message, plugin) => {
            setCurrentMessage(message);
            handleSend(message, 0, plugin);
          }}
          onScrollDownClick={handleScrollDown}
          onRegenerate={() => {
            if (currentMessage) {
              handleSend(currentMessage, 2, null);
            }
          }}
          showScrollDownButton={showScrollDownButton}
        />
      </>
    </div>
  );
});
Chat.displayName = 'Chat';
