import React, { useState, useEffect } from 'react';
import { QuizState, PhysicsTopic } from '../types';
import { generatePhysicsQuiz } from '../services/geminiService';

export const QuizMode: React.FC = () => {
  const [topic, setTopic] = useState<string>(PhysicsTopic.MECHANICS);
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResult: false,
    selectedOption: null,
    loading: false,
  });

  const startQuiz = async () => {
    setQuizState(prev => ({ ...prev, loading: true }));
    try {
      const questions = await generatePhysicsQuiz(topic);
      setQuizState({
        isActive: true,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        showResult: false,
        selectedOption: null,
        loading: false,
      });
    } catch (error) {
      alert("Không thể tạo câu hỏi. Vui lòng thử lại sau.");
      setQuizState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleOptionSelect = (index: number) => {
    if (quizState.selectedOption !== null) return; // Prevent re-selection

    const isCorrect = index === quizState.questions[quizState.currentQuestionIndex].correctIndex;
    
    setQuizState(prev => ({
      ...prev,
      selectedOption: index,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOption: null
      }));
    } else {
      setQuizState(prev => ({ ...prev, showResult: true }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      isActive: false,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      showResult: false,
      selectedOption: null,
      loading: false,
    });
  };

  // Render Loading Screen
  if (quizState.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full glass-panel rounded-xl p-8">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-20 h-20 border-4 border-blue-400 border-b-transparent rounded-full animate-spin reverse-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Đang Tạo Đề Thi...</h2>
        <p className="text-slate-400">AI đang biên soạn các câu hỏi về {topic}</p>
      </div>
    );
  }

  // Render Setup Screen
  if (!quizState.isActive) {
    return (
      <div className="glass-panel rounded-xl p-8 h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 text-purple-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
           </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-6">Thử Thách Kiến Thức</h2>
        <p className="text-slate-300 text-center mb-8">
          Chọn một chủ đề Vật lý để bắt đầu bài kiểm tra nhanh gồm 5 câu hỏi được tạo bởi AI.
        </p>
        
        <div className="w-full max-w-md space-y-4">
          <label className="block text-sm font-medium text-slate-400">Chủ đề</label>
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
          >
            {Object.values(PhysicsTopic).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          
          <button 
            onClick={startQuiz}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 mt-4"
          >
            Bắt Đầu Làm Bài
          </button>
        </div>
      </div>
    );
  }

  // Render Result Screen
  if (quizState.showResult) {
    const percentage = (quizState.score / quizState.questions.length) * 100;
    return (
      <div className="glass-panel rounded-xl p-8 h-full flex flex-col items-center justify-center animate-fade-in">
        <h2 className="text-4xl font-bold text-white mb-2">Kết Quả</h2>
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          {quizState.score}/{quizState.questions.length}
        </div>
        <p className="text-slate-300 text-lg mb-8">
          {percentage === 100 ? "Xuất sắc! Bạn là thiên tài vật lý!" : 
           percentage >= 80 ? "Rất tốt! Kiến thức vững vàng." :
           percentage >= 50 ? "Khá tốt, hãy cố gắng thêm nhé." :
           "Cần ôn tập lại kiến thức cơ bản."}
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Render Question Screen
  const currentQ = quizState.questions[quizState.currentQuestionIndex];
  const hasAnswered = quizState.selectedOption !== null;

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="glass-panel rounded-2xl p-6 md:p-10 w-full">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-6 text-sm text-slate-400 uppercase tracking-wider font-semibold">
          <span>Câu hỏi {quizState.currentQuestionIndex + 1} / {quizState.questions.length}</span>
          <span>Điểm: {quizState.score}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-purple-500 h-full transition-all duration-500"
            style={{ width: `${((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((option, idx) => {
            let btnClass = "bg-slate-800/50 border-slate-600 hover:bg-slate-700";
            if (hasAnswered) {
              if (idx === currentQ.correctIndex) btnClass = "bg-green-900/50 border-green-500 text-green-200";
              else if (idx === quizState.selectedOption) btnClass = "bg-red-900/50 border-red-500 text-red-200";
              else btnClass = "bg-slate-800/50 border-slate-700 opacity-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={hasAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${btnClass}`}
              >
                <span className="font-bold mr-3 opacity-70">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {hasAnswered && (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-xl mb-6 ${
              quizState.selectedOption === currentQ.correctIndex 
                ? "bg-green-900/20 border border-green-900" 
                : "bg-blue-900/20 border border-blue-900"
            }`}>
              <p className="text-slate-300">
                <span className="font-bold text-white block mb-1">Giải thích:</span> 
                {currentQ.explanation}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                {quizState.currentQuestionIndex === quizState.questions.length - 1 ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};