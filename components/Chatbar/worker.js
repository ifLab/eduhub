// Web Worker 代码 (worker.js)

self.addEventListener('message', async (event) => {
    const { type, conversationId, folderId } = event.data;
  
    if (type === 'moveConversation') {
      try {
        // 执行异步操作
        await handleMoveToFolder(conversationId, folderId);
        console.log('移动操作完成');
      } catch (error) {
        console.error('移动操作出错', error);
      }
    }
  });