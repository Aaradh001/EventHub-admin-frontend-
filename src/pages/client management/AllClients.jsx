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

function AllClients() {
  const baseURL = BASE_URL;
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
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

        setClients(response.data.results.results);
        setFilteredClients(response.data.results.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        setPageCount(response.data.results.total_pages);
        setCurrentPage(response.data.results.current_page);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  };



  const handleSearch = (query) => {
    setIsLoading(false)
    setSearchQuery(query);
    // fetchUsers(`${baseURL}/admin-control/all-clients/?search=${query}`);
  };

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const filteredItems = clients.filter(client => {
      const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
      const userName = client.client.username.toLowerCase();
      const email = client.client.email.toLowerCase();
      if (fullName.startsWith(query) || userName.startsWith(query) || email.startsWith(query)) {
        return true;
      }
      return false;
    })
    if (filteredClients.length != filteredItems.length) {
      setFilteredClients(filteredItems)
    }
  } else {
    if (filteredClients.length != clients.length) {
      setFilteredClients(clients)
    }
  }

  const clientControl = (clientId, isActive) => {
    axios
      .patch(`${baseURL}admin-control/client-management/client/${clientId}/`,
        {
          'client': {
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
        const updatedClients = clients.map(client => {
          if (client.id === clientId) {
            isActive ? showMessage(true, `The user ${client.client.username} is now active !`)
              : showMessage(false, `The user ${client.client.username} is now blocked !`)
            return { ...client, client: { ...client.client, is_active: isActive } };
          }
          return client;
        });
        setClients(updatedClients);
        setFilteredClients(updatedClients);
        console.log("updated  :", updatedClients);
        // showMessage(false, message)
      })
      .catch((error) => {
        const message = `Error updating client active status: ${error}`
        showMessage(false, message)
        console.error("Error updating client status:", error);
      });
  };

  useEffect(() => {
    fetchUsers(baseURL + "/admin-control/client-management/clients/");
  }, []);

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="h-full ml-14 mt-14 mb-10 md:ml-64">
          <h4 className="my-4 mx-2 ">All Clients</h4>

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
                      <th className="px-4 py-3">First name</th>
                      <th className="px-4 py-3">Last name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3 text-center">Active Status</th>
                      <th className="px-4 py-3 text-center">Block/Unblock</th>
                      {/* <th className="px-4 py-3">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {filteredClients.length === 0 && (
                      <tr>
                        <td>No Users Found Your Match</td>
                      </tr>
                    )}
                    {filteredClients.map((client) => (
                      <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400" key={client.id}>
                        <td className="px-4 py-3">
                          <div className="flex justify-center text-sm">
                            <div className="relative  w-8 h-8 mr-3 rounded-full ">
                              <img
                                src={
                                  client.profile_pic
                                    ? client.profile_pic
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
                          <Link to={`client-detail/${client.id}`} className="mr-4 text-blue-200 hover:text-blue-500 cursor-pointer ">
                            {client.client.username}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">{client.first_name}</td>
                        <td className="px-4 py-3 text-sm">{client.last_name}</td>
                        <td className="px-4 py-3 text-sm">{client.client.email}</td>
                        <td className="px-4 py-3 text-sm">{client.client.phone_number}</td>
                        <td className="px-4 py-3 text-sm text-center">{client.client.is_active ? "Active" : "Not Active"}</td>
                        <td className="px-4 py-3 text-sm flex justify-center">
                          {/* <div className="inline-flex items-center">
                            <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer"> */}
                          <label htmlFor={`switch${client.id}`}
                            className="relative inline-flex items-center cursor-pointer">
                            <input checked={client.client.is_active} onChange={(e) => clientControl(client.id, e.target.checked)} type="checkbox"
                              className="sr-only peer"
                              id={`switch${client.id}`}
                            />
                            <div className="peer rounded-br-xl rounded-tl-xl flex items-center outline-none duration-100 after:duration-500 w-14 h-7 bg-red-500 peer-checked:bg-green-500 after:content-['N'] after:absolute after:outline-none after:rounded-br-lg after:rounded-tl-lg after:h-5 after:w-5 after:bg-white after:left-1 after:flex after:justify-center after:items-center  after:text-sky-800 after:font-bold peer-checked:after:translate-x-6 peer-checked:after:content-['Y'] peer-checked:after:border-white">
                            </div>
                          </label>
                          {/* </div>
                          </div> */}
                        </td>
                        {/* <td>
                          <Menu as="div" className="relative inline-block text-left">
                          <div>
                          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                          Options
                          <ChevronDownIcon
                          className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                          aria-hidden="true"
                          />
                          </Menu.Button>
                          </div>
                          <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                          >
                          <Menu.Items className="absolute z-50 right-10 bottom-0  mt-2 w-25 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                              <div className="px-1 py-1 ">
                              <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                      // to={""}
                                      className={`${
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                      Edit
                                      </Link>
                                      )}
                                      </Menu.Item>
                                      <Menu.Item>
                                      {({ active }) => (
                                        <Link
                                    // to={""}
                                    className={`${
                                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                    Duplicate
                                    </Link>
                                    )}
                                    </Menu.Item>
                                    </div>
                                    </Menu.Items>
                                    </Transition>
                                    </Menu>
                                  </td> */}
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

export default AllClients;