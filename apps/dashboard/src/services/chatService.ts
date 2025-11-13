import type { TaskType } from '../schemas/taskCreation.schema';
import { EventSourcePolyfill } from 'event-source-polyfill';
import apiClient, { getAuthToken } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface ChatServiceOptions {
  mode: 'question-generation' | 'review-test';
  taskType: TaskType;
  taskField: string;
  onMessage: (content: string) => void;
  onError: (error: Error) => void;
  onDone: () => void;
}

export interface ChatService {
  subscribe: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  disconnect: () => void;
}

export const createChatService = (
  options: ChatServiceOptions
): ChatService => {
  let eventSource: EventSourcePolyfill | null = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  const BASE_RETRY_DELAY = 1000; // 1초

  const setupEventListeners = (es: EventSourcePolyfill) => {
    es.addEventListener('connected', (e) => {
      console.log('SSE connected:', e);
      retryCount = 0; // 연결 성공 시 재시도 카운터 초기화
    });

    es.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      options.onMessage(data.content);
    });

    es.addEventListener('done', () => {
      options.onDone();
    });

    es.addEventListener('heartbeat', () => {
      console.log('SSE heartbeat received - connection alive');
    });

    es.onerror = () => {
      console.error('SSE connection error');
      es.close();
      eventSource = null;

      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount - 1);
        console.log(`Reconnecting in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})...`);

        setTimeout(() => {
          subscribe().catch((error) => {
            console.error('Reconnection failed:', error);
          });
        }, delay);
      } else {
        console.error('Max reconnection attempts reached');
        options.onError(new Error('채팅 연결에 실패했습니다'));
      }
    };
  };

  const subscribe = async () => {
    const params = new URLSearchParams({
      taskType: options.taskType,
      taskField: options.taskField,
    });

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    // mode에 따라 엔드포인트 선택
    const endpoint = options.mode === 'review-test'
      ? API_ENDPOINTS.CHAT.TEST_SUBSCRIBE
      : API_ENDPOINTS.CHAT.SUBSCRIBE;

    const url = `${baseUrl}${endpoint}?${params}`;

    const tokenGetter = getAuthToken();
    const token = tokenGetter ? await tokenGetter : null;

    if (!token) {
      options.onError(new Error('인증 토큰을 가져올 수 없습니다. 다시 로그인해주세요.'));
      return;
    }

    eventSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    setupEventListeners(eventSource);
  };

  const sendMessage = async (message: string) => {
    // mode에 따라 엔드포인트 선택
    const endpoint = options.mode === 'review-test'
      ? API_ENDPOINTS.CHAT.TEST_MESSAGE
      : API_ENDPOINTS.CHAT.MESSAGE;

    await apiClient.post(endpoint, {
      message,
    });
  };

  const disconnect = () => {
    retryCount = MAX_RETRIES;
    eventSource?.close();
    eventSource = null;
  };

  return { subscribe, sendMessage, disconnect };
};
