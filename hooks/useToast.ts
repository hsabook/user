import { toast as sonnerToast } from 'sonner';

// Helper function để debug toast
export function debugToast(message: string, data?: any) {
  console.log(`[Toast Debug] ${message}`, data);
}

export function useToast() {
  const toast = sonnerToast;
  
  // Thêm debug logs
  debugToast('Toast object:', toast);
  
  return toast;
} 