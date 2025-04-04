"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';

interface MediaUploaderProps {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function MediaUploader({
  onUploadSuccess,
  onUploadError,
  accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
  maxSizeMB = 10,
  className = '',
}: MediaUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadProgress, isUploading, error } = useMediaUpload();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File quá lớn. Kích thước tối đa là ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    
    // Tạo preview URL nếu là ảnh
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadFile(selectedFile);
      onUploadSuccess?.(response.data.url);
      
      // Reset state sau khi upload thành công
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      onUploadError?.(error || 'Upload failed');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {!selectedFile ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
          />
          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Kéo thả file vào đây hoặc <span className="text-green-500 font-medium">chọn file</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Hỗ trợ: Ảnh, PDF, Word, Excel, PowerPoint, TXT (Tối đa {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-10 h-10 object-cover rounded mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                  <span className="text-xs text-gray-500">
                    {selectedFile.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={isUploading}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {isUploading ? (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center justify-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span>Tải lên</span>
            </button>
          )}
          
          {error && (
            <div className="mt-2 flex items-center text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 