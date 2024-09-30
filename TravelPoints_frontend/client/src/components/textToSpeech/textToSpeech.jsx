import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text }) => {
  const [isPaused, setIsPaused] = useState(true);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      synth.speak(utterance);
      setIsPaused(false);
    }
    else{
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(true);
  };

  return (
  <div>
    <button onClick={handlePlay} className="bg-transparent border border-gray-500 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded inline-flex items-center mr-5 ml-5">
      {isPaused ? "Play" : "Pause"}
      {isPaused ? 
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg> :
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h2v14H9V5zm8 0h-2v14h2V5z"></path></svg>}
    </button>
    <button onClick={handleStop} className="bg-transparent border border-red-500 hover:bg-red-200 text-red-500 font-bold py-2 px-4 rounded inline-flex items-center">
      Stop
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z"></path></svg>
    </button>
  </div>


  );
};

export default TextToSpeech;
