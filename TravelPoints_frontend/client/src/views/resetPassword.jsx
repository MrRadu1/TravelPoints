import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Email } from "../externals/account.svg";
import { ReactComponent as Key } from "../externals/Key.svg";
import axios from "axios";
import LoginBackground from "../externals/reset.jpg";
import { useParams } from "react-router-dom";


const PasswordReset = () => {
  const { verificationCode } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
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

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    if (!validatePassword(inputPassword)) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const inputConfirmPassword = e.target.value;
    setConfirmPassword(inputConfirmPassword);
    if (inputConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
        await axios.post("http://localhost/api/User/resetPassword", {
          email,
          verification: verificationCode,
          newPassword: password,
        });
        console.log("Password reset successful!");
        navigate("/login");
      } catch (error) {
        console.error("Error resetting password:", error);
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
          <span className="text-[rgba(23,23,37,1)] text-[30px] font-semibold text-center font-poppins">
            Reset Password
          </span>
          {(emailError || passwordError || confirmPasswordError) && (
            <span className="text-[#a93f3f] text-[15px] font-semibold text-center font-poppins">
              {emailError || passwordError || confirmPasswordError}
            </span>
          )}
           <div className="flex flex-col items-start justify-center gap-10">
            <div className="flex flex-col items-end gap-8">
              <div className="flex flex-col items-start gap-4">
                <div className="flex flex-col items-center self-stretch gap-6">
            <form className="flex flex-col items-start self-stretch gap-4">
              <div className="flex items-center w-full self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                <div className="relative w-[22px] h-[17.200050354003906px] flex items-start flex-shrink-1">
                  <Email />
                </div>
                <input
                  className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                  placeholder="Your email"
                  onChange={(e) => handleEmailChange(e)}
                />
              </div>
              <div className="flex items-center w-full self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                <div className="relative w-[19px] h-[18.999996185302734px] flex items-start flex-shrink-1">
                  <Key />
                </div>
                <input
                  className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                  type="password"
                  placeholder="New Password"
                  onChange={(e) => handlePasswordChange(e)}
                />
              </div>
              <div className="flex items-center w-full self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                <div className="relative w-[19px] h-[18.999996185302734px] flex items-start flex-shrink-1">
                  <Key />
                </div>
                <input
                  className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => handleConfirmPasswordChange(e)}
                />
              </div>
            </form>
            <button
                onClick={handlePasswordReset}
                className="flex items-center justify-center gap-2.5 p-3 self-stretch bg-[rgba(16,46,56,1)] rounded-lg"
              >
                <span className="text-white text-[15px] font-semibold text-center font-poppins">
                  Reset Password
                </span>
              </button>
              </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
