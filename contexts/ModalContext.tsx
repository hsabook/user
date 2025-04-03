"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
  isActivateModalOpen: boolean;
  openActivateModal: () => void;
  closeActivateModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const openActivateModal = () => {
    setIsActivateModalOpen(true);
  };

  const closeActivateModal = () => {
    setIsActivateModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isActivateModalOpen,
        openActivateModal,
        closeActivateModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}; 