"use client";

import { useState } from 'react';
import { FileText, Clock, Book, Zap, ChevronRight } from 'lucide-react';
import QuestionModal from './QuestionModal';
import { Exam as ExamType } from '@/hooks/useChapter';

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  score: number | null;
  question: {
    id: string;
    code_id: string;
    video?: string | null;
    question: string;
    type: string;
    solution?: string;
    options: {
      type: string;
      value: string;
      answer: string;
      checked: boolean;
    }[];
    answers: string[];
    subject: string;
    level: string;
  };
}

interface ExamData {
  id: string;
  code_id: string;
  title: string;
  title_search: string;
  description: string | null;
  subject: string;
  time: string | null;
  file_download: string | null;
  exams_question: ExamQuestion[];
}

interface ExamQuestionListProps {
  exam: ExamData | ExamType;
}

const ExamQuestionList = ({ exam }: ExamQuestionListProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion['question'] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openQuestionModal = (question: ExamQuestion['question']) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsModalOpen(false);
  };

  // Phân loại câu hỏi theo mức độ
  const questionsByLevel = {
    easy: exam.exams_question.filter((q: ExamQuestion) => q.question.level === 'easy'),
    medium: exam.exams_question.filter((q: ExamQuestion) => q.question.level === 'medium'),
    hard: exam.exams_question.filter((q: ExamQuestion) => q.question.level === 'hard' || q.question.level === 'difficult')
  };

  if (!exam || !exam.exams_question || exam.exams_question.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mb-4">
          <FileText className="h-12 w-12 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700">Không có câu hỏi</h3>
        <p className="text-gray-500 mt-2">Bài kiểm tra này hiện không có câu hỏi nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thông tin bài kiểm tra */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">{exam.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mã đề</p>
              <p className="font-medium">{exam.code_id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Book className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Môn học</p>
              <p className="font-medium">{exam.subject}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Thời gian</p>
              <p className="font-medium">{exam.time || 'Không giới hạn'}</p>
            </div>
          </div>
        </div>
        
        {exam.description && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exam.description }} />
          </div>
        )}
        
        {exam.file_download && (
          <div className="mt-4">
            <a 
              href={exam.file_download} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span>Tải xuống bộ đề</span>
            </a>
          </div>
        )}
      </div>
      
      {/* Thống kê số lượng câu hỏi theo mức độ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Câu hỏi dễ</h3>
            <div className="bg-green-100 text-green-800 rounded-full h-8 w-8 flex items-center justify-center">
              {questionsByLevel.easy.length}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-yellow-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Câu hỏi trung bình</h3>
            <div className="bg-yellow-100 text-yellow-800 rounded-full h-8 w-8 flex items-center justify-center">
              {questionsByLevel.medium.length}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Câu hỏi khó</h3>
            <div className="bg-red-100 text-red-800 rounded-full h-8 w-8 flex items-center justify-center">
              {questionsByLevel.hard.length}
            </div>
          </div>
        </div>
      </div>
      
      {/* Danh sách câu hỏi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Danh sách câu hỏi ({exam.exams_question.length})</h3>
        </div>
        
        <div className="divide-y">
          {exam.exams_question.map((examQuestion: ExamQuestion, index: number) => (
            <div 
              key={examQuestion.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => openQuestionModal(examQuestion.question)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-medium">{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Câu hỏi: {examQuestion.question.code_id}</h4>
                      <div className="text-sm text-gray-600 mt-1" dangerouslySetInnerHTML={{ 
                        __html: examQuestion.question.question.length > 150 
                          ? examQuestion.question.question.substring(0, 150) + '...' 
                          : examQuestion.question.question 
                      }} />
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs mr-2 ${
                        examQuestion.question.level === 'easy' ? 'bg-green-100 text-green-800' :
                        examQuestion.question.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {examQuestion.question.level === 'easy' ? 'Dễ' : 
                         examQuestion.question.level === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{examQuestion.question.type}</span>
                    {examQuestion.question.video && (
                      <span className="ml-3 text-blue-600 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        </svg>
                        Có video
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal hiển thị chi tiết câu hỏi */}
      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          isOpen={isModalOpen}
          onClose={closeQuestionModal}
        />
      )}
    </div>
  );
};

export default ExamQuestionList; 