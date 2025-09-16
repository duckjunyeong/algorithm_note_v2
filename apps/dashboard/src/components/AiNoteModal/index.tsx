import { useAiNoteModal } from './useAiNoteModal';
import { AiNoteModalView } from './AiNoteModal.view';
import { ChoiceView } from './views/ChoiceView';
import { UrlInputView } from './views/UrlInputView';
import { ManualInputView } from './views/ManualInputView';
import { CodeInputView } from './views/CodeInputView';
import { ResultsView } from './views/ResultsView';
import { useAiNoteModalStore } from '../../store/useAiNoteModalStore';

export function AiNoteModal() {
  const {
    isModalOpen,
    isExitConfirmationVisible,
    currentView,
    viewSizes,
    handleOverlayClick,
    handleConfirmExit,
    handleCancelExit,
  } = useAiNoteModal();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'CHOICE':
        return <ChoiceView />;
      case 'URL_INPUT':
        return <UrlInputView />;
      case 'MANUAL_INPUT':
        return <ManualInputView />;
      case 'CODE_INPUT':
        return <CodeInputView />;
      case 'RESULTS':
        return <ResultsView />;
      default:
        return <ChoiceView />;
    }
  };

  return (
    <AiNoteModalView
      isModalOpen={isModalOpen}
      isExitConfirmationVisible={isExitConfirmationVisible}
      currentView={currentView}
      viewSizes={viewSizes}
      onOverlayClick={handleOverlayClick}
      onConfirmExit={handleConfirmExit}
      onCancelExit={handleCancelExit}
    >
      {renderCurrentView()}
    </AiNoteModalView>
  );
}