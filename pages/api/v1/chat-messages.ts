import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { headers } = req;
  // 目标 URL 应该从环境变量或配置中获取，而不是硬编码
  const targetUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000/v1/chat-messages'; 
  console.log(`[API Proxy] Forwarding request to: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 确保 Authorization 头存在且有效
        'Authorization': headers.authorization || '', 
        // 可以考虑转发其他必要的头信息
        'Accept': 'text/event-stream', 
      },
      body: JSON.stringify(req.body),
      // duplex: 'half' 可能在某些 Node.js 版本中需要用于流式请求体
      // @ts-ignore
      duplex: 'half', 
    });

    console.log(`[API Proxy] Target API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Proxy] Target API error (${response.status}): ${errorText}`);
      // 尝试解析 JSON 错误，如果失败则返回文本
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText || '请求目标 API 失败' };
      }
      return res.status(response.status).json({
        ...errorData,
        status: response.status
      });
    }

    // 确认目标 API 返回的是流式数据
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/event-stream')) {
        console.warn(`[API Proxy] Target API did not return text/event-stream, got: ${contentType}`);
        // 如果不是流，可以尝试读取整个响应体并返回，或者报错
        const responseBody = await response.text();
        return res.status(200).send(responseBody); // 或者根据情况调整
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform'); // no-transform 很重要
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // 建议用于 Nginx 等反向代理

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('[API Proxy] Failed to get reader from response body.');
      throw new Error('无响应数据');
    }

    // 直接将读取到的数据块转发给客户端
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('[API Proxy] Stream finished.');
          break; // 流结束
        }
        if (value) {
          // 直接写入收到的数据块 (假设目标 API 已正确格式化 SSE)
          res.write(value);
        }
      }
    } catch (streamError) {
       console.error('[API Proxy] Error reading or writing stream:', streamError);
       // 尝试通知客户端流已中断，但这可能不会成功
       if (!res.writableEnded) {
           res.write('event: error\ndata: {"message": "Stream interrupted"}\n\n');
       }
    } finally {
       // 确保流读取器被释放
       reader.releaseLock();
       // 确保响应结束
       if (!res.writableEnded) {
           res.end();
       }
       console.log('[API Proxy] Response stream ended.');
    }

  } catch (error) {
    console.error('[API Proxy] Request failed:', error);
    // 避免在流已经开始后发送 JSON 错误
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '内部服务器错误',
        status: 500 
      });
    } else if (!res.writableEnded) {
      // 如果流已开始但未结束，尝试发送错误事件并结束
      res.write(`event: error\ndata: {"message": "Internal Server Error"}\n\n`);
      res.end();
    }
  }
}