"use client"
import React, { useState } from 'react';
import languages from './constants';
import { translateText } from './translate';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface PopupProps {
    typedText: string;
}

const Popup: React.FC<PopupProps> = ({ typedText }) => {
    const pathname = usePathname(); 
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    const handleTranslate = async () => {
        setIsTranslating(true);
        const translatedText = await translateText({ selectedLanguage, typedText });
        setTranslatedText(translatedText);
        setShowPopup(true);
        setIsTranslating(false);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const isSpecificUrl = pathname === '/profile/user_2j2XRyPAA19HbXxdnBlY3Tl4gAJ';

    return (
        <div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowPopup(true)}
            >
                <Image
                    src="/assets/translate.svg"
                    alt="translate"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain rounded-full"
                />
            </button>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className={`shadow-lg rounded-lg w-full max-w-md p-6 ${
                            isSpecificUrl
                                ? 'bg-white text-gray-800'
                                : 'bg-gray-300 text-gray-800'
                        }`}
                    >
                        <div className="flex justify-end">
                            <button
                                className={`hover:text-gray-400 ${
                                    isSpecificUrl ? 'text-gray-600' : 'text-gray-500'
                                }`}
                                onClick={handleClosePopup}
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <h2 className={`text-2xl font-bold mb-4 ${isSpecificUrl ? 'text-gray-800' : 'text-gray-800'}`}>
                            Translate
                        </h2>
                        <p className={`mb-4 ${isSpecificUrl ? 'text-gray-800' : 'text-gray-700'}`}>
                            {typedText}
                        </p>
                        <select
                            className={`block w-full border-gray-300 p-1 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-4 ${
                                isSpecificUrl
                                    ? 'bg-gray-200 text-gray-800 border-gray-300'
                                    : 'bg-gray-400 text-gray-800 border-gray-300'
                            }`}
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            <option value="">Select a language</option>
                            {Object.keys(languages).map((key) => (
                                <option className={`bg-white ${isSpecificUrl ? 'text-gray-800' : ''}`} key={key} value={key}>
                                    {languages[key as keyof typeof languages]}
                                </option>
                            ))}
                        </select>
                        <button
                            className={`font-bold py-2 px-4 rounded mb-4 ${
                                isSpecificUrl
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-dark-3 hover:bg-dark-1 text-white'
                            }`}
                            onClick={handleTranslate}
                            disabled={isTranslating}
                        >
                            {isTranslating ? 'Translating...' : 'Translate'}
                        </button>
                        {translatedText && (
                            <div className="max-h-40 overflow-y-auto">
                                <p className={`font-medium ${isSpecificUrl ? 'text-gray-800' : 'text-gray-700'}`}>
                                    {translatedText}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popup;