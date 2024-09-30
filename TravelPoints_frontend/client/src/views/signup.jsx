import React, { useState } from "react";
import LoginBackground from "../externals/tokyo.jpg";
import { Link } from "react-router-dom";
import { ReactComponent as Email } from "../externals/account.svg";
import { ReactComponent as Key } from "../externals/Key.svg";
import { ReactComponent as User } from "../externals/icons8-account-48.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = (props) => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userError, setUserError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSignup = async () => {
    setOpen(false);
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      await axios
        .post("http://localhost/api/User/Register", {
          id: {},
          username: username,
          name: username,
          email: email,
          password: password,
          role: 0,
          whishlist: []
        })
        .then((response) => {
          if (response.status === 200) {
            setOpen(false);
            navigate("/login");
          }
        }).catch((error) => {
          console.log(error.response.data)
          if (error.response.data === "Username is already in use.") {
            setOpen(true);
            setErrorMessage("Username is already in use.");
          } else if (error.response.data === "Email is already in use.") {
            setOpen(true);
            setErrorMessage("Email is already in use.");
          }
          setOpen(true);
          console.log(error);
        });
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    if (!validateEmail(inputEmail)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(""); // Clear the error if the email is valid
    }
  };

  const handleUsernameChange = (e) => {
    setUserError(""); // Clear the error if the username is valid
    const inputUsername = e.target.value;
    setUsername(inputUsername);
    if (inputUsername.length === 0) {
      setUserError("");
    }
    setUsername(inputUsername);
    if (inputUsername.length < 7) {
      setUserError("Invalid Username");
    }
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    // Add any specific validation for the password here, if needed
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    const inputConfirmPassword = e.target.value;
    setConfirmPassword(inputConfirmPassword);
    if (inputConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(""); // Clear the error if passwords match
    }
  };

  return (
    <div className="w-full flex overflow-auto min-h-screen items-center flex-col">
      <div className="w-full h-[100vh] flex overflow-hidden relative items-start flex-shrink-0 ">
        <img
          src={LoginBackground}
          class="absolute top-0 left-0 w-full h-[100vh]"
        />
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-black opacity-40" />
        <div className="absolute top-[125px] left-[756px] w-[625px] h-[157.60498046875px] flex items-start flex-shrink-0">
          {}
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
            Sign Up
          </span>
          {open ? (
            <span className="text-[#a93f3f] text-[15px] font-semibold text-center font-poppins">
              {errorMessage}
            </span>
          ) : null}
          <div className="flex flex-col items-start justify-center gap-10">
            <div className="flex flex-col items-end gap-8">
              <div className="flex flex-col items-start gap-4">
                <div className="flex flex-col items-center self-stretch gap-6">
                  <form className="flex flex-col items-start self-stretch gap-4">
                    <div className="flex items-center self-stretch gap-3 px-[8px] py-[8px] border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                      <div className="relative w-[30px] flex items-start flex-shrink-0">
                        <User />
                      </div>
                      <input
                        onChange={(e) => {
                          handleUsernameChange(e);
                        }}
                        className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                        placeholder="Your Username"
                      />
                      {userError && (
                        <div className="absolute left-[35em] text-red-500 text-xs">
                          {userError}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                      <div className="relative w-[22px] h-[17.200050354003906px] flex items-start flex-shrink-0">
                        <Email />
                      </div>
                      <input
                        onChange={(e) => {
                          handleEmailChange(e);
                        }}
                        className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                        placeholder="Your email"
                      />
                      {emailError && (
                        <div className="absolute left-[35em] text-red-500 text-xs">
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center self-stretch gap-4 p-3 border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                      <div className="relative w-[19px] h-[18.999996185302734px] flex items-start flex-shrink-1">
                        <Key />
                      </div>
                      <input
                        onChange={(e) => {
                          handlePasswordChange(e);
                        }}
                        className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                        type="password"
                        placeholder="Password"
                      />
                      {passwordError && (
                        <div className="absolute left-[35em] text-red-500 text-xs">
                          {passwordError}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center self-stretch gap-4 p-3  border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg bg-white">
                      <div className="relative w-[19px] h-[18.999996185302734px] flex items-start flex-shrink-1">
                        <Key />
                      </div>
                      <input
                        onChange={(e) => {
                          handleConfirmPasswordChange(e);
                        }}
                        className="text-rgba(23,23,37,1) w-full text-[14px] font-medium leading-normal font-poppins focus:outline-none"
                        type="password"
                        placeholder="Confirm Password"
                      />
                      {confirmPasswordError && (
                        <div className="absolute left-[35em] text-red-500 text-xs left-10">
                          {confirmPasswordError}
                        </div>
                      )}
                    </div>
                  </form>

                  <button
                    onClick={() => handleSignup()}
                    className="flex items-center justify-center gap-2.5 p-3 self-stretch bg-[rgba(16,46,56,1)] rounded-lg"
                  >
                    <span className="text-white text-[15px] font-semibold text-center font-poppins">
                      Sign Up
                    </span>
                  </button>
                  <div className="flex flex-col items-center gap-5">
                    <div className="flex items-center self-stretch gap-5 w-[401px]">
                      <div className="bg-slate-300 w-44 h-[1px]"></div>

                      <span className="text-[rgba(150,153,183,1)] text-[14px] font-medium text-center font-poppins">
                        or
                      </span>
                      <div className="bg-slate-300 w-44 h-[1px]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex self-stretch flex-col gap-5 items-start flex-shrink-0">
                  <button className="flex gap-3.75 p-2 self-stretch items-center border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg justify-center bg-white">
                    <div className="relative w-[27px] h-[27.55061912536621px]flex flex-col flex-shrink-1">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="relative right-32"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="text-[rgba(23,23,37,1)] text-[14px] font-semibold font-poppins">
                      Google
                    </span>
                  </button>
                  <button className="flex gap-3.75 p-2 self-stretch items-center border-[1.6037530899047852px] border-[rgba(224,226,233,1)] rounded-lg justify-center bg-white">
                    <div className="relative w-[36px] h-[27px] flex items-start flex-shrink-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 48 48"
                        className="relative top bottom-9 right-[122px]"
                      >
                        <path
                          fill="#3F51B5"
                          d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                        ></path>
                        <path
                          fill="#FFF"
                          d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-[rgba(23,23,37,1)] text-[14px] font-semibold font-poppins">
                      Facebook
                    </span>
                  </button>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-[rgba(150,154,184,1)] text-[15px] font-normal text-center font-poppins leading-6">
                    Arleady have an account?
                  </span>
                  <Link
                    to="/login"
                    className="text-[rgba(16,46,56,1)] text-[15px] font-semibold text-center font-poppins leading-6"
                  >
                    Log in
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

export default Signup;
