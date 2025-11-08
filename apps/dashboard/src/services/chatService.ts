import apiClient, { getAuthToken } from './apiClient';
import type {
  ChatInitializeRequest,
  ChatInitializeResponse,
  ChatMessageRequest
} from '../schemas/chat.schema';
import {
  chatInitializeRequestSchema,
  chatInitializeResponseSchema,
  chatMessageRequestSchema
} from '../schemas/chat.schema';

export class ChatService {

  async initializeChatSession(
    taskType: 'concept' | 'memorization' | 'approach',
    taskField: string | null
  ): Promise<string> {
    const requestData: ChatInitializeRequest = { taskType, taskField };
    const validatedRequest = chatInitializeRequestSchema.parse(requestData);

    try {
      const response = await apiClient.post<ChatInitializeResponse>(
        '/chat/initialize',
        validatedRequest
      );

      const validatedResponse = chatInitializeResponseSchema.parse(response.data);

      if (!validatedResponse.success) {
        throw new Error(validatedResponse.message || '채팅 세션 생성에 실패했습니다');
      }

      return validatedResponse.sessionId;
    } catch (error: any) {
      console.error('Failed to initialize chat session:', error);
      throw new Error(
        error.response?.data?.message || error.message || '채팅 세션 초기화 실패'
      );
    }
  }

  streamChatMessage(
    sessionId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void 
  ): EventSource {
    const requestData: ChatMessageRequest = { sessionId, message };
    const validatedRequest = chatMessageRequestSchema.parse(requestData);

    const url = apiClient.getUri({ url: '/chat/stream' });
    console.log('SSE URL:', url);

    const eventSource = this.createSSEConnection(url, validatedRequest, {
      onMessage: onChunk,
      onDone: onComplete,
      onError: onError
    });

    return eventSource;
  }

  private createSSEConnection(
    url: string,
    body: any,
    callbacks: {
      onMessage: (chunk: string) => void;
      onDone: () => void;
      onError: (error: Error) => void;
    }
  ): EventSource {
    const abortController = new AbortController();

    (async () => {
      const token = await getAuthToken();
      console.log('요청을 보냅니다.  ---> ', url);
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...(token && {
            Authorization: `Bearer ${token}`
          })
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });
    })()
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            callbacks.onDone();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); 

              if (data === '[DONE]') {
                callbacks.onDone();
                break;
              }

              callbacks.onMessage(data);
            } else if (line.startsWith('event: ')) {
              const eventType = line.slice(7);

              if (eventType === 'done') {
                callbacks.onDone();
                break;
              } else if (eventType === 'error') {
                callbacks.onError(new Error('Server error occurred'));
              }
            }
          }
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          callbacks.onError(error);
        }
      });

    return {
      close: () => abortController.abort(),
      readyState: 1, // OPEN
      url,
      withCredentials: false,
      CONNECTING: 0,
      OPEN: 1,
      CLOSED: 2,
      onopen: null,
      onmessage: null,
      onerror: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    } as EventSource;
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await apiClient.delete(`/chat/session/${sessionId}`);
    } catch (error: any) {
      console.error('Failed to delete chat session:', error);
      throw new Error(error.response?.data?.message || '세션 삭제 실패');
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
