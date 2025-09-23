// ConfirmModal/index.tsx
import type { FC } from 'react';
import { ConfirmModalView } from './ConfirmModal.view';
import type { ConfirmModalViewProps } from './ConfirmModal.view';

const ConfirmModal: FC<ConfirmModalViewProps> = (props) => {
  return <ConfirmModalView {...props} />;
};

export default ConfirmModal;