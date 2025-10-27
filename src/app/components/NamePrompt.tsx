// src/app/components/NamePrompt.tsx
'use client'; 

import { useState, useEffect } from 'react';

const USER_NAME_KEY = 'aiam_username';

export function getLocalUsername(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(USER_NAME_KEY);
    }
    return null;
}

export default function NamePrompt() {
    const [name, setName] = useState('');
    const [isPromptVisible, setIsPromptVisible] = useState(false);

    useEffect(() => {
        const storedName = getLocalUsername();
        
        // <<< บรรทัดนี้สำหรับ Debugging ใน Console >>>
        console.log('Stored Username:', storedName); 
        
        if (!storedName) {
            setIsPromptVisible(true); 
        }
    }, []);

    const handleSave = () => {
        if (name.trim()) {
            localStorage.setItem(USER_NAME_KEY, name.trim());
            setIsPromptVisible(false);
            window.location.reload(); 
        }
    };

    if (!isPromptVisible) return null; 

    // UI ของ Pop-up
    return (
        // <<< เพิ่ม z-[9999] เพื่อป้องกันถูกบัง >>>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"> 
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-indigo-600">ยินดีต้อนรับสู่ AiAm!</h2>
                <p className="mb-6 text-gray-700">กรุณาระบุชื่อเล่นเพื่อติดตามความคืบหน้า</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น สมชาย หรือ สมหญิง"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleSave}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                    disabled={!name.trim()}
                >
                    เริ่มต้นใช้งาน
                </button>
            </div>
        </div>
    );
}