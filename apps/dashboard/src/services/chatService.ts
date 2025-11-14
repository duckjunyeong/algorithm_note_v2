import type { TaskType } from '../schemas/taskCreation.schema';
import { EventSourcePolyfill } from 'event-source-polyfill';
import apiClient, { getAuthToken } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface ChatServiceOptions {
  mode: 'question-generation' | 'review-test';
  taskType: TaskType;
  taskField: string;
  tutorLevel?: string;
  reviewCardId?: number;
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

      // EventSource를 완전히 종료하여 브라우저 자동 재연결 방지
      try {
        es.close();
      } catch (error) {
        console.warn('Error closing EventSource:', error);
      }

      // eventSource를 null로 설정하여 중복 연결 방지
      if (eventSource === es) {
        eventSource = null;
      }

      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount - 1);
        console.log(`Reconnecting in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES}) with fresh token...`);

        setTimeout(async () => {
          try {
            // 재연결 시 새로운 토큰으로 완전히 새로운 EventSource 인스턴스 생성
            await subscribe();
          } catch (error) {
            console.error('Reconnection failed:', error);
            options.onError(error instanceof Error ? error : new Error('재연결 실패'));
          }
        }, delay);
      } else {
        console.error('Max reconnection attempts reached');
        options.onError(new Error('채팅 연결에 실패했습니다'));
      }
    };
  };

  const subscribe = async () => {
    // 기존 연결이 있다면 완전히 정리
    if (eventSource) {
      console.log('Closing existing EventSource before creating new one');
      try {
        eventSource.close();
      } catch (error) {
        console.warn('Error closing existing EventSource:', error);
      }
      eventSource = null;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    let endpoint: string;
    let params: URLSearchParams;

    if (options.mode === 'review-test') {
      endpoint = API_ENDPOINTS.CHAT.TEST_SUBSCRIBE;
      params = new URLSearchParams({
        reviewCardId: options.reviewCardId!.toString(),
        tutorLevel: options.tutorLevel!,
      });
    } else {
      endpoint = API_ENDPOINTS.CHAT.SUBSCRIBE;
      params = new URLSearchParams({
        taskType: options.taskType,
        taskField: options.taskField,
      });
    }

    const url = `${baseUrl}${endpoint}?${params}`;

    // 매번 최신 토큰을 가져와서 사용 (재연결 시 갱신된 토큰 사용)
    const tokenGetter = getAuthToken();
    const token = tokenGetter ? await tokenGetter : null;

    if (!token) {
      options.onError(new Error('인증 토큰을 가져올 수 없습니다. 다시 로그인해주세요.'));
      return;
    }

    console.log('Creating new EventSource with fresh token');
    eventSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      heartbeatTimeout: 120000, // 2분 heartbeat 타임아웃 (서버는 15초마다 전송)
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
    console.log('Disconnecting chat service');

    // 재시도 카운터를 최대치로 설정하여 자동 재연결 방지
    retryCount = MAX_RETRIES;

    // EventSource가 있다면 완전히 종료
    if (eventSource) {
      try {
        eventSource.close();
        console.log('EventSource closed successfully');
      } catch (error) {
        console.warn('Error closing EventSource:', error);
      }
      eventSource = null;
    }
  };

  return { subscribe, sendMessage, disconnect };
};
