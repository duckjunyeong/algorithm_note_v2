// RegisterProblemModal/index.tsx
import type { FC } from 'react';
import { useRegisterProblemModal } from './useRegisterProblemModal';
import { RegisterProblemModalView } from './RegisterProblemModal.view';

type RegisterProblemModalProps = {
  isOpen: boolean;
  onAttemptClose: () => void;
};

const RegisterProblemModal: FC<RegisterProblemModalProps> = ({ isOpen, onAttemptClose }) => {
  const logic = useRegisterProblemModal({ isOpen });

  return (
    <RegisterProblemModalView
      isOpen={isOpen}
      onAttemptClose={onAttemptClose}
      logic={logic}
    />
  );
};

export default RegisterProblemModal;