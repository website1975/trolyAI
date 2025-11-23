import React, { useState, useRef } from 'react';
import { solvePhysicsProblem } from '../services/geminiService';

export const ProblemSolver: React.FC = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!text && !image) return;

    setIsAnalyzing(true);
    setSolution(null);

    try {
      const result = await solvePhysicsProblem(text, image || undefined);
      setSolution(result);
    } catch (error) {
      setSolution("Xin lỗi, không thể xử lý bài toán này. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="glass-panel rounded-xl p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3.666a2.176 2.176 0 01-.866 1.9c-1.12.68-2.572.876-3.134 1.914C10.53 15.408 11.167 17 13.5 17m0 0V19m0-2h-1.5m1.5 0a2 2 0 10-2.543-3.432" />
          </svg>
          Giải Bài Tập
        </h2>
        
        <div className="space-y-4 flex-1">
          {/* Image Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors relative ${image ? 'border-green-500 bg-green-900/20' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            
            {image ? (
              <div className="relative h-48 w-full flex items-center justify-center">
                 <img src={image} alt="Problem" className="max-h-full max-w-full object-contain rounded shadow-lg" />
                 <button 
                   onClick={(e) => { e.stopPropagation(); setImage(null); }}
                   className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </button>
              </div>
            ) : (
              <div className="py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-300 font-medium">Tải ảnh bài tập lên</p>
                <p className="text-slate-500 text-sm">hoặc nhấp để chọn ảnh</p>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">Nội dung câu hỏi / Ghi chú thêm</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-green-500 h-32 resize-none"
              placeholder="Nhập đề bài hoặc câu hỏi cụ thể của bạn ở đây..."
            ></textarea>
          </div>

          <button
            onClick={handleSolve}
            disabled={isAnalyzing || (!text && !image)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              isAnalyzing || (!text && !image)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-green-500/25'
            }`}
          >
            {isAnalyzing ? 'Đang Phân Tích...' : 'Giải Bài Tập'}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="glass-panel rounded-xl p-6 h-full overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Lời Giải Chi Tiết</h2>
        <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 scrollbar-hide">
          {solution ? (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap font-mono text-sm md:text-base">
              {solution}
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p>AI đang suy nghĩ và tính toán...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};