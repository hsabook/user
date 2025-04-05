"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface QuestionOption {
  type: string;
  value: string;
  answer: string;
  checked: boolean;
}

interface Question {
  id: string;
  code_id: string;
  question: string;
  video?: string | null;
  type: string;
  solution?: string;
  options: QuestionOption[];
  answers: string[];
  level: string;
  subject: string;
}

interface QuestionModalProps {
  question: Question;
  onClose: () => void;
  isOpen: boolean;
}

// Hàm kiểm tra iframe
const isIframeVideo = (videoString: string | null): boolean => {
  if (!videoString) return false;
  return videoString.trim().startsWith('<iframe') && videoString.trim().endsWith('</iframe>');
};

const QuestionModal = ({ question, onClose, isOpen }: QuestionModalProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Xử lý đóng modal với animation
  const handleClose = () => {
    setIsClosing(true);
    // Đợi hiệu ứng animation hoàn thành rồi mới thực sự đóng modal
    setTimeout(() => {
      onClose();
    }, 300); // Tăng thời gian để khớp với duration của animation
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 m-0 p-0 w-full h-full min-h-screen bg-black/50 backdrop-blur-sm z-[9999]" style={{ margin: 0 }}>
      <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 m-0 w-full h-full flex items-center justify-center p-4" style={{ margin: 0 }}>
        <div 
          ref={modalRef}
          className={`w-full max-w-3xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-xl border border-green-200 shadow-xl relative flex flex-col ${
            isClosing 
              ? 'animate-out slide-out-to-bottom-4 zoom-out-95 duration-300 ease-in-out' 
              : 'animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 ease-out will-change-transform'
          }`}
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Header Modal */}
          <div className="flex justify-between items-center border-b border-green-100 px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl sticky top-0 z-10">
            <h3 className="text-lg font-medium text-green-800">
              Câu hỏi: <span className="text-green-600">{question.code_id}</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs rounded-full ${
                question.level === 'easy' ? 'bg-green-100 text-green-800' :
                question.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.level === 'easy' ? 'Dễ' : 
                 question.level === 'medium' ? 'Trung bình' : 'Khó'}
              </span>
              <button 
                onClick={handleClose} 
                className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-green-200 text-green-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Video nếu có */}
            {question.video && isIframeVideo(question.video) && (
              <div className="mb-6">
                <div className="aspect-video bg-white bg-opacity-50 rounded-xl overflow-hidden relative border border-green-100 shadow-sm">
                  <div 
                    className="absolute inset-0 w-full h-full" 
                    dangerouslySetInnerHTML={{
                      __html: question.video.replace('<iframe', '<iframe style="width:100%; height:100%; border:0;"')
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Nội dung câu hỏi */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-green-700 mb-2">Câu hỏi:</h4>
              <div 
                className="text-gray-800 p-4 bg-white bg-opacity-60 rounded-xl border border-green-100 shadow-sm"
                dangerouslySetInnerHTML={{ __html: question.question }}
              />
            </div>
            
            {/* Các lựa chọn */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-green-700 mb-2">Lựa chọn:</h4>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      showAnswer && option.checked 
                        ? 'border-green-400 bg-green-50 shadow-md' 
                        : 'border-green-100 hover:bg-green-50 bg-white bg-opacity-60'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-800 font-medium">
                        {option.type}
                      </div>
                      <div 
                        className="flex-1"
                        dangerouslySetInnerHTML={{ __html: option.value }}
                      />
                      {showAnswer && option.checked && (
                        <div className="ml-2 text-green-600 font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Đáp án đúng
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hiển thị giải thích (nếu có) */}
            {showAnswer && question.solution && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-green-700 mb-2">Giải thích:</h4>
                <div 
                  className="text-gray-800 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm"
                  dangerouslySetInnerHTML={{ __html: question.solution }}
                />
              </div>
            )}
          </div>
          
          {/* Footer với các nút - nằm cố định ở dưới */}
          <div className="flex justify-between px-6 py-4 border-t border-green-100 bg-gradient-to-r from-green-50 to-green-100 rounded-b-xl sticky bottom-0 z-10">
            <div>
              <span className="text-sm text-gray-600">
                Loại: <span className="font-medium text-green-700">{question.type}</span>
              </span>
            </div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                showAnswer 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Ẩn đáp án</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Xem đáp án</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Thêm CSS cho custom scrollbar
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(34, 197, 94, 0.2);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 197, 94, 0.4);
  }
`;

export default QuestionModal;

// Thêm style vào document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
} 