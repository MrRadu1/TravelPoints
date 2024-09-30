import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/screen4/navbar";
import { useAuth } from "../context/authcontext";
import {jwtDecode} from "jwt-decode"; 

const Contact = () => {
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        const user = jwtDecode(token);
        console.log(user); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = jwtDecode(token);
    try {
      await axios.post("http://localhost/api/User/SendFeedback", message, {
      params: {
        userName: user.email,
      },
      headers: {
        'Content-Type': 'application/json', 
      },
    });
      setIsSent(true);
    } catch (error) {
      setError("Failed to send message. Please try again later.");
    }
  };

  const handleAskAnotherQuestion = () => {
    setIsSent(false);
    setMessage("");
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-[rgba(217,237,130,1)]">
        <div className="bg-[rgba(217,237,130,1)] flex items-center gap-3 flex-shrink-0 self-stretch">
          <div className="flex justify-end items-center gap-[226px] py-1">
            <div className="w-[822px] h-[349px] flex flex-col justify-center items-start gap-2.5 p-0 px-[77px] flex-shrink-0">
              <div className="flex flex-col justify-center items-start gap-8">
                <span className="text-[#141B34] w-[729px] text-left leading-normal font-[PlayfairDisplay] text-[60px] font-bold">
                  Send an email to the administrator.
                </span>
                <span className="text-[#141B34] w-[618px] text-left leading-normal font-[Inter] text-[18px] font-medium">
                  Request more information or suggest updates!
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-80 py-1">
          {isSent ? (
            <div className="text-center py-3">
              <p className="text-[#141B34] font-[Inter] text-[22px] font-medium">Email successfully sent to the administrator!</p>
              <button
                onClick={handleAskAnotherQuestion}
                className="mt-4 px-4 py-2 bg-[rgba(16,46,56,1)] text-white rounded-md hover:bg-[rgba(16,46,56,1)] transition-colors focus:outline-none"
              >
                Ask another question
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded-md px-3 py-2 w-full h-40 focus:outline-none"
                required
              ></textarea>
              <button
                type="submit"
                className="flex items-center justify-center gap-2.5 p-3 self-stretch bg-[rgba(16,46,56,1)] rounded-lg"
              >
                <span className="text-white text-[15px] font-semibold text-center font-poppins">
                  Send message
                </span>
              </button>
              {error && <p className="text-[#141B34] font-[Inter] text-[22px] font-medium">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
