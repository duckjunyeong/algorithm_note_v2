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
            messages: [...currentMessages]
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
        messages: [...currentMessages]
      });
    }
  }

  return questions;
}
