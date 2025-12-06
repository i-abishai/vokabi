import React, { useState } from 'react';
import { emojiOptions } from '../constants';

const ProfileScreen = ({ onCreateProfile }) => {
  const [tempName, setTempName] = useState('');
  const [tempEmoji, setTempEmoji] = useState('');

  const handleSubmit = () => {
    if (tempName && tempEmoji) {
      onCreateProfile(tempName, tempEmoji);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Profil Oluştur
        </h2>

        <div className="mb-6">
          <label className="block text-purple-600 font-semibold mb-2">
            Adın ne?
          </label>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
            placeholder="Adını yaz..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-purple-600 font-semibold mb-2">
            Bir emoji seç:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {emojiOptions.map((emoji, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setTempEmoji(emoji)}
                className={`text-4xl p-3 rounded-xl transition-all transform hover:scale-110 ${
                  tempEmoji === emoji
                    ? 'bg-purple-200 ring-4 ring-purple-400'
                    : 'hover:bg-purple-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!tempName || !tempEmoji}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Devam Et 🚀
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
