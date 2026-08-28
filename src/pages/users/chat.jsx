import React, { useState, useEffect, useRef } from "react";
import { FaMicrochip, FaLeaf, FaSpinner } from 'react-icons/fa';
import { BiBot } from 'react-icons/bi';

function Chat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Halo! Selamat datang di Verdatica. Ada yang bisa saya bantu seputar perawatan tanamanmu hari ini?",
            sender: "bot"
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: currentInput }),
            });

            const data = await response.json();

            const botResponse = {
                id: Date.now() + 1,
                text: data.reply,
                sender: "bot"
            };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [...prev, {
                id: Date.now(),
                text: "Maaf, sepertinya ada gangguan koneksi ke server Verdatica.",
                sender: "bot"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                                <BiBot />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Chat Bot
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaMicrochip className="text-emerald-500" />
                                    Konsultasi perawatan tanaman dengan AI
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isLoading
                                    ? 'bg-yellow-50 text-yellow-600'
                                    : 'bg-green-50 text-green-600'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-bounce' : 'bg-green-500 animate-pulse'
                                    }`} />
                                {isLoading ? 'Sedang mengetik...' : 'Sistem Aktif'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.sender === "user"
                                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-tr-none shadow-emerald-200"
                                            : "bg-white text-gray-700 border border-gray-200 rounded-tl-none shadow-sm"
                                        }`}
                                >
                                    {msg.sender === "bot" && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">
                                                <FaLeaf />
                                            </div>
                                            <span className="text-xs font-medium text-emerald-600">Verdatica Bot</span>
                                        </div>
                                    )}
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <FaSpinner className="text-emerald-500 animate-spin" />
                                        <span className="text-sm text-gray-500">Verdatica sedang mengetik...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Form */}
                    <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                placeholder={isLoading ? "Tunggu sebentar..." : "Tanyakan sesuatu tentang tanaman..."}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-emerald-500 transition-all text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3.5 rounded-xl transition-all font-medium shadow-lg shadow-emerald-100 active:scale-95 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Kirim
                                    </>
                                ) : (
                                    'Kirim'
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-gray-400 mt-3 text-center">
                            💡 Tips: Tanyakan tentang perawatan, penyakit, atau kondisi tanaman Anda
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;