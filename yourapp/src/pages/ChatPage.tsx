"use client"
// var _s = $RefreshSig$(); // टेम्पोररी तौर पर कमेंट आउट करें
import "react-native-get-random-values";
import { useEffect, useState, useRef } from "react"
import { Mic, Send, StopCircle } from "lucide-react"

export default function ChatInterface() {
  const [text, setText] = useState("Hey, how can I help?")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai"; isLoading?: boolean }>>([])
  const [chatStarted, setChatStarted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Mock audio recording functionality
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // In a real app, you would process the recording here
      setInputValue("Voice message transcribed...")
    } else {
      setIsRecording(true)
      // In a real app, you would start recording here
    }
  }

  useEffect(() => {
    let index = 0
    const fullText = "Hey, how can I help?"
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(intervalId)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      // Add user message
      const userMessage = inputValue
      setMessages([...messages, { text: userMessage, sender: "user" }])
      setInputValue("")
      setChatStarted(true)

      // Simulate AI thinking with loading state
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "", sender: "ai", isLoading: true }])

        // Simulate AI response after a delay
        setTimeout(() => {
          setMessages((prev) => {
            const newMessages = [...prev]
            // Replace the loading message with the actual response
            newMessages[newMessages.length - 1] = {
              text: `I'm Suhu AI. I've received your message: "${userMessage}"`,
              sender: "ai",
            }
            return newMessages
          })
        }, 2000)
      }, 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-between p-2 sm:p-4">
      <div className="w-full max-w-3xl flex flex-col gap-3 mt-10 sm:mt-20 relative">
        {!chatStarted && (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <div className="relative sm:left-[-30px]">
                <RotatingCube />
              </div>
              <h1 className="text-gray-800 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center sm:ml-4">
                {text}
              </h1>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xl mt-4 mx-auto px-2">
              <button
                onClick={() => setInputValue("What are the best stocks to buy today? 📈")}
                className="text-left px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-200 shadow-sm"
              >
                <span className="text-gray-700">📈 What are the best stocks to buy today?</span>
              </button>
              <button
                onClick={() => setInputValue("Show me AI predictions for Nifty 50 🤖")}
                className="text-left px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-200 shadow-sm"
              >
                <span className="text-gray-700">🤖 Show me AI predictions for Nifty 50</span>
              </button>
              <button
                onClick={() => setInputValue("How to diversify my investment portfolio? 💼")}
                className="text-left px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-200 shadow-sm"
              >
                <span className="text-gray-700">💼 How to diversify my investment portfolio?</span>
              </button>
            </div>
          </>
        )}

        {chatStarted && (
          <div ref={chatContainerRef} className="w-full flex flex-col gap-2 mt-4 max-h-[70vh] overflow-y-auto p-2 pb-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                {msg.sender === "ai" && msg.isLoading && (
                  <div className="self-start mb-1 ml-4 flex items-center">
                    <div className="w-5 h-5 mr-1">
                      <RotatingCube size={20} />
                    </div>
                    <span className="text-xs text-gray-500">Suhu is thinking...</span>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                    msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <span>...</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mb-4 sm:mb-8 px-2">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder={isRecording ? "Recording..." : "Message to Suhu 🤖"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-4 pr-24 py-3 sm:py-4 bg-white border ${
              isRecording ? "border-red-400 animate-pulse" : "border-gray-300"
            } rounded-full text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md`}
          />

          <button
            onClick={toggleRecording}
            className={`absolute right-12 p-2 ${
              isRecording ? "bg-red-100 text-red-500" : "hover:bg-gray-100 text-gray-600"
            } rounded-full transition-colors duration-200`}
            aria-label={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleSendMessage}
            className="absolute right-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

import type React from "react"

export const RotatingCube: React.FC<{ size?: number }> = ({ size = 40 }) => {
  const halfSize = size / 2

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1200px",
        width: `${size + 20}px`,
        height: `${size + 20}px`,
      }}
    >
      <style>
        {`
          .cube-container {
            transform: rotateZ(45deg) rotateX(50.74deg);
            transform-style: preserve-3d;
          }

          .cube {
            width: ${size}px;
            height: ${size}px;
            position: relative;
            transform-style: preserve-3d;
            animation: vertex-rotate 8s infinite linear;
          }

          .face {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 1.5px solid rgba(70, 70, 70, 0.8);
            background: transparent;
            box-sizing: border-box;
            backface-visibility: visible;
          }

          .front { transform: translateZ(${halfSize}px); }
          .back { transform: translateZ(-${halfSize}px) rotateY(180deg); }
          .right { transform: rotateY(90deg) translateZ(${halfSize}px); }
          .left { transform: rotateY(-90deg) translateZ(${halfSize}px); }
          .top { transform: rotateX(90deg) translateZ(${halfSize}px); }
          .bottom { transform: rotateX(-90deg) translateZ(${halfSize}px); }

          @keyframes vertex-rotate {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
        `}
      </style>

      <div className="cube-container">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: 10,
    marginBottom: 4
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 16
  },
  changeContainerColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
};


