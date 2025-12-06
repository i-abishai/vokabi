import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-8 animate-bounce">🌸</div>
        <h1 className="text-5xl font-bold text-white mb-4">vokabi</h1>
        <p className="text-xl text-white mb-8">İngilizce Kelime Öğrenme Oyunu</p>
        <button
          type="button"
          onClick={onStart}
          className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
        >
          Başlayalım! 🚀
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
