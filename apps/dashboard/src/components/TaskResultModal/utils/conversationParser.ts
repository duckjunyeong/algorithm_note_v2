import type { ChatMessage, ReviewQuestionInfo } from '../../../services/chatSessionService';

export interface QuestionConversation {
  questionIndex: number;
  questionText: string;
  reviewQuestionId: number;
  messages: Array<{
    role: 'user' | 'model';
    content: string;
  }>;
}

export function filterAIMessages(
  messages: Array<{ role: 'user' | 'model'; content: string }>
): Array<{ role: 'user' | 'model'; content: string }> {
  const firstAIIndex = messages.findIndex(msg => msg.role === 'model');

  if (firstAIIndex === -1) {
    return [...messages];
  }

  const tempMessages = [
    ...messages.slice(0, firstAIIndex),
    ...messages.slice(firstAIIndex + 1)
  ];

  let lastAIIndexInTemp = -1;
  for (let i = tempMessages.length - 1; i >= 0; i--) {
    if (tempMessages[i].role === 'model') {
      lastAIIndexInTemp = i;
      break;
    }
  }

  if (lastAIIndexInTemp !== -1) {
    return [
      ...tempMessages.slice(0, lastAIIndexInTemp),
      ...tempMessages.slice(lastAIIndexInTemp + 1)
    ];
  }

  return tempMessages;
}

export function parseConversationByQuestions(
  conversationHistory: ChatMessage[],
  reviewQuestions: ReviewQuestionInfo[]
): QuestionConversation[] {
  const questions: QuestionConversation[] = [];
  let currentQuestionIndex = -1;
  let currentMessages: Array<{ role: 'user' | 'model'; content: string }> = [];

  conversationHistory.forEach((message) => {
    // Match Korean format: ## 🤔 질문 [1/1] or English format: ## Question 1:
    const koreanQuestionMatch = message.content.match(/##\s*🤔\s*질문\s*\[(\d+)\/\d+\]/);
    const englishQuestionMatch = message.content.match(/^##\s*Question\s+(\d+):/i);
    const questionMatch = koreanQuestionMatch || englishQuestionMatch;

    if (questionMatch && message.role === 'model') {
      // Save previous question's messages
      if (currentQuestionIndex >= 0 && currentMessages.length > 0) {
        const questionInfo = reviewQuestions[currentQuestionIndex];
        if (questionInfo) {
          questions.push({
            questionIndex: currentQuestionIndex + 1,
            questionText: questionInfo.questionText,
            reviewQuestionId: questionInfo.reviewQuestionId,
            messages: filterAIMessages([...currentMessages])
          });
        }
      }

      // Start new question
      currentQuestionIndex = parseInt(questionMatch[1]) - 1;
      currentMessages = [];
    }

    currentMessages.push({
      role: message.role,
      content: message.content
    });
  });

  // Save the last question's messages
  if (currentQuestionIndex >= 0 && currentMessages.length > 0) {
    const questionInfo = reviewQuestions[currentQuestionIndex];
    if (questionInfo) {
      questions.push({
        questionIndex: currentQuestionIndex + 1,
        questionText: questionInfo.questionText,
        reviewQuestionId: questionInfo.reviewQuestionId,
        messages: filterAIMessages([...currentMessages])
      });
    }
  }

  return questions;
}
