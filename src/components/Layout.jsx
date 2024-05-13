import React, { useEffect, useState } from 'react'
import { Outlet, Route } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Bounce, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const newIsDark = !prevIsDark;
      // Update theme in local storage
      window.localStorage.setItem('dark', newIsDark);
      return newIsDark;
    });
  };


  useEffect(() => {
    const setup = () => {
      const getTheme = () => {
        if (window.localStorage.getItem('dark')) {
          return JSON.parse(window.localStorage.getItem('dark'));
        }
        return !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      };


      return {
        loading: true,
        isDark: getTheme(),
      };
    };

    const { loading, isDark } = setup();
    setLoading(loading);
    setIsDark(isDark);
    

    // // Cleanup function if necessary
    // return () => {
    //   // Any cleanup logic here
    // };
  },[]);
  
  return (
    <div className={isDark ? 'dark' : ''}>
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
        theme={`${isDark? 'light' : 'dark'}`}
        transition={Bounce}
      />
      <div className='min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white'>
        <Header toggleTheme={toggleTheme} />
        <Sidebar/>
        {<Outlet/>}
        {/* <Footer/> */}
      </div>
    </div>
  )
}

export default Layout




