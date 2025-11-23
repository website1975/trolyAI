import React, { useState, useEffect } from 'react';
import { ViewMode, PhysicsTopic } from './types';
import { ChatSession } from './components/ChatSession';
import { ProblemSolver } from './components/ProblemSolver';
import { QuizMode } from './components/QuizMode';
import { TopicCard } from './components/TopicCard';
import { getApiKey, saveApiKey } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setHasKey(true);
      setApiKeyInput(key);
    } else {
      // Tự động hiện popup nếu chưa có key lần đầu vào (optional)
      // setShowKeyModal(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput);
      setHasKey(true);
      setShowKeyModal(false);
      alert("Đã lưu API Key thành công!");
      window.location.reload(); // Reload để đảm bảo mọi service nhận key mới
    }
  };

  const renderContent = () => {
    switch (view) {
      case ViewMode.CHAT:
        return <ChatSession />;
      case ViewMode.SOLVER:
        return <ProblemSolver />;
      case ViewMode.QUIZ:
        return <QuizMode />;
      case ViewMode.HOME:
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4 text-center">
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
                Khám Phá Vũ Trụ Vật Lý
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Học tập thông minh hơn với trợ lý AI. Giải bài tập, luyện thi trắc nghiệm và hỏi đáp lý thuyết mọi lúc mọi nơi.
              </p>
              {!hasKey && (
                <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg inline-block text-yellow-200 text-sm animate-pulse">
                  ⚠️ Bạn chưa nhập API Key. Vui lòng bấm vào nút Chìa khóa (🔑) ở góc trên để cài đặt.
                </div>
              )}
            </div>

            <TopicCard 
              title="Hỏi Đáp AI" 
              icon="💬" 
              description="Trò chuyện với Gia sư AI về bất kỳ chủ đề vật lý nào. Giải thích khái niệm, định luật."
              colorClass="border-blue-500/30 hover:border-blue-400 bg-blue-900/10"
              onClick={() => setView(ViewMode.CHAT)}
            />
            <TopicCard 
              title="Giải Bài Tập" 
              icon="📸" 
              description="Chụp ảnh đề bài hoặc nhập nội dung câu hỏi. AI sẽ hướng dẫn giải chi tiết từng bước."
              colorClass="border-green-500/30 hover:border-green-400 bg-green-900/10"
              onClick={() => setView(ViewMode.SOLVER)}
            />
             <TopicCard 
              title="Luyện Thi" 
              icon="📝" 
              description="Thử thách kiến thức với các bài kiểm tra trắc nghiệm được tạo tự động theo chủ đề."
              colorClass="border-purple-500/30 hover:border-purple-400 bg-purple-900/10"
              onClick={() => setView(ViewMode.QUIZ)}
            />

            <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-8">
              <h3 className="text-xl font-bold text-slate-300 mb-4 pl-2 border-l-4 border-blue-500">Chủ Đề Phổ Biến</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.values(PhysicsTopic).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setView(ViewMode.QUIZ)}
                    className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-sm font-medium transition-colors border border-slate-700 hover:border-slate-500 text-left"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col selection:bg-purple-500 selection:text-white bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewMode.HOME)}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">PhysiMind</span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex space-x-2">
                <NavButton active={view === ViewMode.HOME} onClick={() => setView(ViewMode.HOME)} label="Trang chủ" />
                <NavButton active={view === ViewMode.CHAT} onClick={() => setView(ViewMode.CHAT)} label="Hỏi Đáp" />
                <NavButton active={view === ViewMode.SOLVER} onClick={() => setView(ViewMode.SOLVER)} label="Giải Bài" />
                <NavButton active={view === ViewMode.QUIZ} onClick={() => setView(ViewMode.QUIZ)} label="Trắc Nghiệm" />
              </div>
              
              {/* Mobile Menu Dropdown could go here, simplified for now */}
              
              <button 
                onClick={() => setShowKeyModal(true)}
                className={`p-2 rounded-full transition-colors ${hasKey ? 'text-green-400 hover:bg-green-900/20' : 'text-red-400 hover:bg-red-900/20 animate-pulse'}`}
                title="Cài đặt API Key"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🔑</span> Cài đặt API Key
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Để sử dụng AI, bạn cần nhập Google Gemini API Key. Key này sẽ được lưu an toàn trên trình duyệt của bạn.
            </p>
            <div className="mb-4">
              <label className="block text-slate-400 text-xs uppercase font-bold mb-2">API Key</label>
              <input 
                type="password" 
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={handleSaveKey}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
              >
                Lưu Key
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 text-xs hover:underline flex items-center gap-1"
              >
                Chưa có key? Lấy miễn phí tại đây
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden h-[calc(100vh-4rem)]">
        {renderContent()}
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {label}
  </button>
);

export default App;