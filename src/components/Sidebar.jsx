import React, { useState } from 'react';
import "../assets/styles/customStyle.css";
import { LiaUsersCogSolid } from "react-icons/lia";
import { PiUsersThreeLight } from "react-icons/pi";
import { IoGolfOutline } from "react-icons/io5";
import { AiOutlineDatabase } from "react-icons/ai";

import {
  Collapse,
  // Ripple,
  initTWE
} from "tw-elements";

import { Link, NavLink } from 'react-router-dom';

const Sidebar = () => {
  initTWE({ Collapse });
  return (
    <div className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-blue-900 dark:bg-gray-900 h-full text-white transition-all duration-300 z-10 border-none sidebar">
      <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          <li className="px-5 hidden md:block">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
            </div>
          </li>
          <li>
            <NavLink exact='true' to={'/'} activeclassname="active" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <a href="#client-management"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6 transition duration-150 ease-in-out"
              data-twe-collapse-init
              aria-expanded="false"
              aria-controls="client-management"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <LiaUsersCogSolid className="w-5 h-5" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Client Management</span>
            </a>

            <div
              className="!visible hidden"
              id="client-management"
              data-twe-collapse-item>
              <NavLink activeclassname="active" to={"client-management/"} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800  dark:hover:bg-gray-400 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span className="inline-flex justify-center items-center ml-8">
                  <PiUsersThreeLight className='w-4 h-4' />
                </span>
                <span className="ml-2 text-xs tracking-wide truncate">All Clients</span>
              </NavLink>
            </div>
          </li>

          <li>
            <a href="#vendor-management"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6 transition duration-150 ease-in-out"
              data-twe-collapse-init
              aria-expanded="false"
              aria-controls="vendor-management"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <LiaUsersCogSolid className="w-5 h-5" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Vendor Management</span>
            </a>

            <div
              className="!visible hidden"
              id="vendor-management"
              data-twe-collapse-item>
              <NavLink activeclassname="active" to={"vendor-management/"} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800  dark:hover:bg-gray-400 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span className="inline-flex justify-center items-center ml-8">
                  <PiUsersThreeLight className='w-4 h-4' />
                </span>
                <span className="ml-2 text-xs tracking-wide truncate">All Vendors</span>
              </NavLink>
            </div>
          </li>


          <li>
            <a href="#venue-management"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6 transition duration-150 ease-in-out"
              data-twe-collapse-init
              aria-expanded="false"
              aria-controls="venue-management"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <IoGolfOutline className="w-5 h-5" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Venue Management</span>
            </a>

            <div
              className="!visible hidden"
              id="venue-management"
              data-twe-collapse-item>
              <NavLink activeclassname="active" to={"venue-management/"} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800  dark:hover:bg-gray-400 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span className="inline-flex justify-center items-center ml-8">
                  <AiOutlineDatabase className='w-4 h-4' />
                </span>
                <span className="ml-2 text-xs tracking-wide truncate">All Venues</span>
              </NavLink>
            </div>
          </li>
          <li>
            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Board</span>
              <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">New</span>
            </a>
          </li>
          <li>
            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
            </a>
          </li>
          <li>
            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
              <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">1.2k</span>
            </a>
          </li>
          <li className="px-5 hidden md:block">
            <div className="flex flex-row items-center mt-5 h-8">
              <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Settings</div>
            </div>
          </li>
          <li>
            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
            </a>
          </li>
          <li>
            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
            </a>
          </li>
        </ul>
        <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2021</p>
      </div>
    </div>
    // Sidebar

  )
}

export default Sidebar
