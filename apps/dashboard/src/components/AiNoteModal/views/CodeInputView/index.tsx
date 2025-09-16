import { useCodeInputView } from './useCodeInputView';
import { CodeInputViewComponent } from './CodeInputView.view';

export function CodeInputView() {
  const {
    codeData,
    isLoading,
    error,
    languageOptions,
    handleCodeChange,
    handleLanguageChange,
    handleAnalyze,
    handleBack,
  } = useCodeInputView();

  return (
    <CodeInputViewComponent
      code={codeData.code}
      language={codeData.language}
      isLoading={isLoading}
      error={error}
      languageOptions={languageOptions}
      onCodeChange={handleCodeChange}
      onLanguageChange={handleLanguageChange}
      onAnalyze={handleAnalyze}
      onBack={handleBack}
    />
  );
}