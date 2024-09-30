import React, { useState } from "react";
import { ReactComponent as Email } from "../externals/account.svg";
import axios from "axios";
import LoginBackground from "../externals/reset.jpg";

const PasswordForgot = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    if (!validateEmail(inputEmail)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordForgot = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    try {
      await axios.post("http://localhost/api/User/forgotPassword", null, {
        params: {
          email: email
        }
      });
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending reset-link:", error);
      setErrorMessage("Error sending reset link. Please try again."); 
    }
  };     

  return (
    <div className="w-full flex overflow-auto min-h-screen items-center flex-col">
      <div className="w-full h-[100vh] flex overflow-hidden relative items-start flex-shrink-0 ">
        <img
          src={LoginBackground}
          className="absolute top-0 left-0 w-full h-[100vh]"
        />
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-black opacity-40" />
        <div className="relative px-40 h-full flex flex-col items-start justify-center gap-10 p-[128px] bg-white">
          {!emailSent && (
            <>
              <span className="text-[rgba(23,23,37,1)] text-[30px] font-semibold text-center font-poppins">
                Forgot your password?
              </span>
              {emailError && (
                <span className="text-[#a93f3f] text-[15px] font-semibold text-center font-poppins">
                  {emailError}
                </span>
              )}
              {errorMessage && ( 
                <span className="text-[#a93f3f] text-[15px] font-semibold text-center font-poppins">
                  {errorMessage}
                </span>
              )}
              <div className="flex flex-col items-start justify-center gap-10">
                <div className="flex flex-col items-end gap-8">
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col items-center self-stretch gap-6">
                      <form className="flex flex-col items-start self-stretch gap-4">
                        <div className="flex items-center self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                          <div className="relative w-[22px] h-[17.200050354003906px] flex items-start flex-shrink-0">
                            <Email />
                          </div>
                          <input
                            className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                            placeholder="Your email"
                            onChange={(e) => handleEmailChange(e)}
                          />
                        </div>
                      </form>
                      <button
                        onClick={handlePasswordForgot}
                        className="flex items-center justify-center gap-2.5 p-3 self-stretch bg-[rgba(16,46,56,1)] rounded-lg"
                      >
                        <span className="text-white text-[15px] font-semibold text-center font-poppins">
                          Send reset link
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {emailSent && (
            <span className="text-[15px] font-semibold text-center font-poppins">
              Reset link sent successfully. Please follow the instructions in your email.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordForgot;
