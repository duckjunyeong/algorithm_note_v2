import { useCodeInputView } from './useCodeInputView';
import { CodeInputViewComponent } from './CodeInputView.view';

export function CodeInputView() {
  const {
    localCode,
    localLanguage,
    extensions,
    isLoading,
    languageOptions,
    handleBack,
    handleCodeChange,
    handleLanguageChange,
    handleAnalyze
  } = useCodeInputView();

  return (
    <CodeInputViewComponent
      localCode={localCode}
      localLanguage={localLanguage}
      extensions={extensions}
      isLoading={isLoading}
      languageOptions={languageOptions}
      onBack={handleBack}
      onCodeChange={handleCodeChange}
      onLanguageChange={handleLanguageChange}
      onAnalyze={handleAnalyze}
    />
  );
}