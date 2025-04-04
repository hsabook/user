import { useState } from 'react';

interface UploadResponse {
  messages: string;
  data: {
    url: string;
  };
  status_code: number;
}

interface UseMediaUploadReturn {
  uploadFile: (file: File) => Promise<UploadResponse>;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
}

export function useMediaUpload(): UseMediaUploadReturn {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.messages || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    error,
  };
} 