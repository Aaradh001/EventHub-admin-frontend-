import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants/constants";
import Loader from "../common/Loader";
import "../../assets/styles/customStyle.css"
import { TError, TSuccess } from "../../components/Toastify";

const AllVenues = () => {
  const baseURL = BASE_URL;
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = localStorage.getItem("access");

  const fetchVenues = async (url) => {
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          setIsLoading(false)
        }, 500)

        setVenues(response.data.results.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        setPageCount(response.data.results.total_pages);
        setCurrentPage(response.data.results.current_page);
      })
      .catch((error) => {
        console.error("Error fetching venues:", error);
        TError("Error fetching data")
      });
  };



  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const venueControl = (venueId, isActive) => {
    axios
      .patch(`${baseURL}admin-control/venue-management/venue/${venueId}/`,
        {
          "is_active": isActive
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      .then((response) => {
        console.log("block unblock   :", response);
        const updatedVenues = venues.map(venue => {
          if (venue.id === venueId) {
            isActive ? TSuccess(`The venue ${venue.name} is active`)
              : TSuccess(`The venue ${venue.name} is now restricted !`)
            return { ...venue, is_active: isActive };
          }
          return venue;
        });
        setVenues(updatedVenues);
        console.log("updated  :", updatedVenues);
      })
      .catch((error) => {
        const message = `Error updating venue status: ${error}`
        TError("Error updating venue status")
        console.error(":", error);
      });
  };

  useEffect(() => {
    fetchVenues(baseURL + "/admin-control/venue-management/all-venues/");
  }, [searchQuery]);

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="h-full ml-14 mt-14 mb-10 md:ml-64">
          <h4 className="my-4 mx-2 ">All Clients</h4>

          <div className="mt-4 mx-4">
            <div className="flex justify-between items-center">
              <div className="mb-4 bg-white rounded py-1 flex items-center max-w-sm p-1 shadow-sm border border-gray-200">
                <input
                  type="search"
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full pl-3 text-sm text-black outline-none focus:outline-none bg-transparent" />
              </div>
              <Link className="bg-blue-500 dark:bg-gray-100 text-white active:bg-blue-600 dark:text-gray-800 dark:active:text-gray-700 text-xs font-bold uppercase px-3 py-2 rounded outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150" to="add-venue">
                Add Venue
              </Link>
            </div>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      {/* <th className="px-2 py-3 text-center">Image</th> */}
                      <th className="px-4 py-3">Name</th>
                      <th className="px-2 py-3">Full address</th>
                      <th className="px-2 py-3">Capacity</th>
                      <th className="px-2 py-3">Management</th>
                      <th className="px-2 py-3">Charges/day</th>
                      <th className="px-2 py-3">Category</th>
                      <th className="px-2 py-3 ">Reservation Status</th>
                      <th className="px-4 py-3 text-center">Block/Unblock</th>
                      {/* <th className="px-4 py-3">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {venues.length === 0 && (
                      <tr>
                        <td>No Users Found Your Match</td>
                      </tr>
                    )}
                    {venues.map((venue) => (
                      <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400" key={venue.id}>
                        {/* <td className="px-4 py-3">
                          <div className="flex justify-center text-sm">
                            <div className="relative  w-8 h-8 mr-3 rounded-full ">
                              temp data
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
                        </td> */}
                        <td className="px-4 py-3 text-sm">
                          <Link to={`venue-detail/${venue.id}`} className="mr-4 text-blue-200 hover:text-blue-500 cursor-pointer ">
                            {venue.name}
                          </Link>
                        </td>
                        <td title="Scroll left-right to see full address" className="text-sm overflow-hidden whitespace-nowrap max-w-48 group">
                          <div className="px-2 py-3 w-full h-full truncate">{venue.full_address}</div>
                        </td>
                        {/* <td className="px-4 py-3 text-sm overflow-hidden whitespace-nowrap hover:overflow-x-auto max-w-48 text-ellipsis">{venue.full_address}</td> */}
                        <td className="px-2 py-3 text-sm">{venue.capacity}</td>
                        <td className="px-2 py-3 text-sm">{venue.management_company}</td>
                        <td className="px-2 py-3 text-sm">{venue.rental_fees}</td>
                        <td className="px-2 py-3 text-sm">{venue.venue_type}</td>
                        <td className="px-2 py-3 text-sm text-center">{venue.reservation_status}</td>
                        {/* <td className="px-4 py-3 text-sm text-center">{venue.is_active ? "Active" : "Not Active"}</td> */}
                        <td className="px-4 py-3 text-sm text-center">
                          {/* <div className="inline-flex items-center">
                              <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer"> */}
                          <label htmlFor={`switch${venue.id}`}
                            className="relative inline-flex items-center cursor-pointer">
                            <input checked={venue.is_active} onChange={(e) => venueControl(venue.id, e.target.checked)} type="checkbox"
                              className="sr-only peer"
                              id={`switch${venue.id}`}
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
                        <button disabled={!prevPage} onClick={() => fetchVenues(prevPage)} className={`px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple ${!prevPage ? "opacity-50 cursor-not-allowed" : ""}`} aria-label="Previous">
                          {/* <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">VDS
                              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                            </svg> */}
                          PREV
                        </button>
                      </li>

                      <li>
                        <button disabled={!nextPage} onClick={() => fetchVenues(nextPage)} className={`px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple ${!nextPage ? "opacity-50 cursor-not-allowed" : ""}`} aria-label="Next">
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

export default AllVenues
