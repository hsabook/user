"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
  // Modal kích hoạt ID
  isActivateModalOpen: boolean;
  openActivateModal: () => void;
  closeActivateModal: () => void;
  
  // Modal thông tin người dùng
  isUserProfileModalOpen: boolean;
  openUserProfileModal: () => void;
  closeUserProfileModal: () => void;
  
  // Kiểm tra xem có modal nào đang mở không
  isAnyModalOpen: boolean;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  const openActivateModal = () => {
    setIsActivateModalOpen(true);
  };

  const closeActivateModal = () => {
    setIsActivateModalOpen(false);
  };
  
  const openUserProfileModal = () => {
    setIsUserProfileModalOpen(true);
  };

  const closeUserProfileModal = () => {
    setIsUserProfileModalOpen(false);
  };
  
  // Kiểm tra xem có modal nào đang mở không
  const isAnyModalOpen = isActivateModalOpen || isUserProfileModalOpen;

  return (
    <ModalContext.Provider
      value={{
        isActivateModalOpen,
        openActivateModal,
        closeActivateModal,
        
        isUserProfileModalOpen,
        openUserProfileModal,
        closeUserProfileModal,
        
        isAnyModalOpen
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