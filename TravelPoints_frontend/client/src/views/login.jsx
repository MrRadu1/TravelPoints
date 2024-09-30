import React, { useState } from "react";
import LoginBackground from "../externals/login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Email } from "../externals/account.svg";
import { ReactComponent as Key } from "../externals/Key.svg";
import axios from "axios";
import { useAuth } from "../context/authcontext";


const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [open, setOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const {setToken} = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleAuth = async (email, password) => {
    if (!email || !password) {
      setOpen(true);
      return;
    }

    await axios
    .post(
      'http://localhost/api/User/auth',
      { email, password }
    )
    .then((response) => {
      if (response.status === 200) {
        const token = response.data;
        setToken(token);
        console.log('Authentication successful!');
        navigate("/destinations")
      }
    })
    .catch((error) => {
      setOpen(true);
      console.error('Error occurred during authentication:', error);
    });
  
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    if (inputEmail.trim() === "") {
      setEmailError(""); // Clear the error if the email field is empty
    } else if (!validateEmail(inputEmail)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(""); // Clear the error if the email is valid
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
        <div className="absolute top-[125px] left-[756px] w-[625px] h-[157.60498046875px] flex items-start flex-shrink-0">
          <div className="relative mx-40 w-[597px] h-[124px] flex flex-col items-end flex-shrink-0">
            <span className="text-[#28201F] font-normal text-[32px] leading-[44px] font-poppins">
              <span className="font-normal">
                Come with us and embark in majestic{" "}
              </span>
              <span className="text-[rgba(217,237,130,1)]  font-semibold">
                journeys{" "}
              </span>
              <span className="font-normal"> in the </span>
              <span className="text-[rgba(217,237,130,1)] font-semibold">
                beauty of this world.
              </span>
            </span>
          </div>
        </div>
        <div className="relative px-40 h-full flex flex-col items-start justify-center gap-10 p-[128px] bg-white">
          <span className="text-[rgba(23,23,37,1)] text-[30px] font-semibold text-center font-poppins">
            Log In
          </span>
          {open || emailError ? (
            <span className="text-[#a93f3f] text-[15px] font-semibold text-center font-poppins">
              {open ? "Invalid email or password. Try again!" : emailError}
            </span>
          ) : null}
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
                        onChange={(e) => {
                          setOpen(false);
                          handleEmailChange(e);
                        }}
                      ></input>
                    </div>
                    <div className="flex items-center self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                      <div className="relative w-[19px] h-[18.999996185302734px] flex items-start flex-shrink-1">
                        <Key />
                      </div>
                      <input
                        className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                          setOpen(false);
                          setPassword(e.target.value);
                        }}
                      ></input>
                    </div>
                  </form>

                  <button
                    onClick={() => handleAuth(email, password)}
                    className="flex items-center justify-center gap-2.5 p-3 self-stretch bg-[rgba(16,46,56,1)] rounded-lg"
                  >
                    <span className="text-white text-[15px] font-semibold text-center font-poppins">
                      Log In
                    </span>
                  </button>
                  <div className="flex items-center justify-end self-stretch gap-2.5 w-[403px]">
                    <Link 
                      to="/forgot-password"
                      className="text-[rgba(16,46,56,1)] text-[15px] font-semibold text-center leading-6 font-poppins">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-[rgba(150,154,184,1)] text-[15px] font-normal text-center font-poppins leading-6">
                    Don’t have an account?
                  </span>
                  <Link
                    to="/sign-up"
                    className="text-[rgba(16,46,56,1)] text-[15px] font-semibold text-center font-poppins leading-6"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
