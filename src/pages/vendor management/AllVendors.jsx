import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import userimg from "../../assets/images/user.png";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants/constants";

// // For styling
// import { Menu, Transition } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

// Toast
import { toast } from 'react-toastify';
import Loader from "../common/Loader";

function AllVendors() {
  const baseURL = BASE_URL;
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = localStorage.getItem("access");


  const showMessage = (status, message) => {
    status ? toast.success(message, {
      className: 'toast-success',
    }) : toast.error(message, {
      className: 'toast-error',
    })
  };

  const fetchUsers = (url) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          setIsLoading(false)
        }, 500)

        setVendors(response.data.results.results);
        setFilteredVendors(response.data.results.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        setPageCount(response.data.results.total_pages);
        setCurrentPage(response.data.results.current_page);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
      });
  };


  const handleSearch = (query) => {
    setIsLoading(false)
    setSearchQuery(query);
    // fetchUsers(`${baseURL}/admin-control/all-clients/?search=${query}`);
  };
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const filteredItems = vendors.filter(vendors => {
      const company_name = vendors.company_name;
      const userName = vendors.vendor.username.toLowerCase();
      const email = vendors.vendor.email.toLowerCase();
      if (company_name.includes(query) || userName.startsWith(query) || email.startsWith(query)) {
        return true;
      }
      return false;
    })
    if (filteredVendors.length != filteredItems.length) {
      setFilteredVendors(filteredItems)
    }
  } else {
    if (filteredVendors.length != vendors.length) {
      setFilteredVendors(vendors)
    }
  }

  const vendorControl = (vendorId, isActive) => {
    axios.patch(`${baseURL}admin-control/vendor-management/vendor/${vendorId}/`,
      {
        'vendor': {
          "is_active": isActive
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        console.log(response);
        const updatedVendors = vendors.map(vendor => {
          if (vendor.id === vendorId) {
            isActive ? showMessage(true, `The user ${vendor.vendor.username} is now active !`)
              : showMessage(false, `The user ${vendor.vendor.username} is now blocked !`)
            return { ...vendor, vendor: { ...vendor.vendor, is_active: isActive } };
          }
          return vendor;
        });
        setVendors(updatedVendors);
        setFilteredVendors(updatedVendors);
        console.log("updated  :", updatedVendors);
        // showMessage(false, message)
      })
      .catch((error) => {
        const message = `Error updating client active status: ${error}`
        showMessage(false, message)
        console.error("Error updating client status:", error);
      });
  };

  useEffect(() => {
    fetchUsers(baseURL + "/admin-control/vendor-management/vendors/");
  }, []);

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="h-full ml-14 mt-14 mb-10 md:ml-64">
          <h4 className="my-4 mx-2 ">All Vendors</h4>

          {/* <Link className="bg-blue-500 dark:bg-gray-100 text-white active:bg-blue-600 dark:text-gray-800 dark:active:text-gray-700 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" to="user/create">
            Create User
          </Link> */}
          <div className="mt-4 mx-4">
            <div className="mb-4 bg-white rounded flex items-center max-w-xs p-1 shadow-sm border border-gray-200">
              <input
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full pl-3 text-sm text-black outline-none focus:outline-none bg-transparent" />
            </div>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3 text-center">Profile Image</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Company name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3 text-center">Active Status</th>
                      <th className="px-4 py-3 text-center">Block/Unblock</th>
                      {/* <th className="px-4 py-3">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {filteredVendors.length === 0 && (
                      <tr>
                        <td>No Vendors Found Your Match</td>
                      </tr>
                    )}
                    {filteredVendors.map((vendor) => (
                      <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400" key={vendor.id}>
                        <td className="px-4 py-3">
                          <div className="flex justify-center text-sm">
                            <div className="relative  w-8 h-8 mr-3 rounded-full ">
                              <img
                                src={
                                  vendor.profile_pic
                                    ? vendor.profile_pic
                                    : userimg
                                }
                                className="object-cover w-full h-full rounded-full"
                                alt=""
                                loading="lazy"
                              />
                              <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link to={`vendor-detail/${vendor.id}`} className="mr-4 text-blue-200 hover:text-blue-500 cursor-pointer ">
                            {vendor.vendor.username}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">{vendor.company_name}</td>
                        <td className="px-4 py-3 text-sm">{vendor.vendor.email}</td>
                        <td className="px-4 py-3 text-sm">{vendor.vendor.phone_number}</td>
                        <td className="px-4 py-3 text-sm text-center">{vendor.vendor.is_active ? "Active" : "Not Active"}</td>
                        <td className="px-4 py-3 text-sm flex justify-center">
                          {/* <div className="inline-flex items-center">
                            <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer"> */}
                          <label htmlFor={`switch${vendor.id}`}
                            className="relative inline-flex items-center cursor-pointer">
                            <input checked={vendor.vendor.is_active} onChange={(e) => vendorControl(vendor.id, e.target.checked)} type="checkbox"
                              className="sr-only peer"
                              id={`switch${vendor.id}`}
                            />
                            <div className="peer rounded-br-xl rounded-tl-xl flex items-center outline-none duration-100 after:duration-500 w-14 h-7 bg-red-500 peer-checked:bg-green-500 after:content-['N'] after:absolute after:outline-none after:rounded-br-lg after:rounded-tl-lg after:h-5 after:w-5 after:bg-white after:left-1 after:flex after:justify-center after:items-center  after:text-sky-800 after:font-bold peer-checked:after:translate-x-6 peer-checked:after:content-['Y'] peer-checked:after:border-white">
                            </div>
                          </label>
                          {/* </div>
                          </div> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3"> Showing {currentPage} of {pageCount} </span>
                <span className="col-span-2"></span>
                {/* Pagination */}
                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button disabled={!prevPage} onClick={() => fetchUsers(prevPage)} className={`px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple ${!prevPage ? "opacity-50 cursor-not-allowed" : ""}`} aria-label="Previous">
                          {/* <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">VDS
                            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                          </svg> */}
                          PREV
                        </button>
                      </li>

                      <li>
                        <button disabled={!nextPage} onClick={() => fetchUsers(nextPage)} className={`px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple ${!nextPage ? "opacity-50 cursor-not-allowed" : ""}`} aria-label="Next">
                          {/* <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                          </svg> */}
                          NEXT
                        </button>
                      </li>
                    </ul>
                  </nav>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllVendors;