import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { CyberButton } from './CyberButton';

type DialogVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconColor: 'text-red-500',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    buttonVariant: 'secondary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-neon-green',
    buttonVariant: 'primary' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-neon-green',
    buttonVariant: 'primary' as const,
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 ${config.iconColor}`}>
          <Icon size={48} />
        </div>
        <p className="text-gray-300 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex gap-3 w-full">
          <CyberButton
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </CyberButton>
          <CyberButton
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : confirmText}
          </CyberButton>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
