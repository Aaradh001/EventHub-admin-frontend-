import axios from "axios";
import {jwtDecode} from "jwt-decode";
import signupVector from '../../assets/images/signup_vector.svg'
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { set_Authentication } from "../../redux/authentication/authenticationSlice";
import FormInput from "./FormInput"
import { MdAdminPanelSettings } from "react-icons/md";
// Toast
import { toast, Bounce, ToastContainer } from 'react-toastify';

import Loader from "../common/Loader";


import { BASE_URL } from "../../constants/constants";

function Login() {
  const [formError, setFormError] = useState([]);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const baseURL = BASE_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputs = [
    {
      keyId: 1,
      id: "form1Example13",
      label: "Email ID",
      labelclass: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
      placeholder: "Enter the email id . . .",
      type: "email",
      name: "email",
      error: "Enter valid email ID !",
      className: "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
      required: true,
    },
    
    {
      keyId: 2,
      id: "form1Example23",
      label: "Password",
      labelclass: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
      placeholder: "Enter the password . . .",
      type: "password",
      name: "password",
      className: "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
      error: "Password should contain atleast 1 number, 1 alphabet, 1 special character. Total length should be between 5 to 10!",
      // pattern: "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,10}$",
      required: true,
    },
  ];

  const showMessage = (status, message) => {
    status? toast.success(message, {
      className : 'toast-success',
    }) : toast.error(message, {
      className : 'toast-error',
    })
  };



  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    // setFormError([]);
    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    try {
      const res = await axios.post(baseURL + "admin-control/login/", formData);
      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        dispatch(
          set_Authentication({
            name: jwtDecode(res.data.access).username,
            isAuthenticated: true,
            isAdmin: jwtDecode(res.data.access).user_role === 'ADMIN',
          })
        );
        navigate("/");
        return res;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        showMessage(false, error.response.data.detail)
        // setFormError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     if (formError) {
  //       setFormError("");
  //     }
  //   }, 4000);
  //   return () => clearTimeout(timerId);
  // }, [formError]);


  return (
    <>
      <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={"light"}
          transition={Bounce}
        />
      <section className="bg-gray-300 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <MdAdminPanelSettings />
                Administrator
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleLoginSubmit}>
                      {formError["detail"] && (
                      <div className="bg-danger rounded mb-3 py-1 px-2 text-light">
                        {formError["detail"]} !!!
                      </div>
                  )}


                  {inputs.map((input) => {
                    return (
                      <FormInput
                        key={input.keyId}
                        {...input}
                        value={values[input.name]}
                        onChange={handleChange}
                      />
                      );
                      })}

                        {/* <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        </div> */}
                        {/* <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div> */}
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                        {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p> */}
                    </form>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}

export default Login;