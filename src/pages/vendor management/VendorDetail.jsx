import React, { useEffect, useState } from 'react'
import userImg from '../../assets/images/user.png'
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../constants/constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../common/Loader';

const VendorDetails = (props) => {
    const [clientDetail, setClientDetail] = useState(null);
    const {clientId} = useParams();
    const [isloading, setIsLoading] = useState(true)
    console.log('vendor details   :',clientDetail );
    
    const fetchUsers = (url) => {
        const accessToken = localStorage.getItem('access')
        axios
        .get(url,  {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then((response) => {
            console.log(response);
            setTimeout(()=>{
                setIsLoading(false)

            },300)
            setClientDetail(response.data);
        })
        .catch((error) => {
            console.error("Error fetching clients:", error);
            setTimeout(()=>{
                setIsLoading(false)
    
            },2000)
        });
        };


    useEffect(() => {
        fetchUsers(BASE_URL + `/admin-control/vendor-management/vendor/${parseInt(clientId)}`);
      }, []);
      
    return (
        <>
        {isloading? <Loader/>:(
            <div className="h-screen bg-gray-100 ml-14 mt-14 md:ml-64">
                <div className="container mx-auto my-5 p-5">
                    <div className="md:flex no-wrap  ">
                        {/* Left Side */}
                        <div className="w-full md:w-3/12 md:mr-2">
                            {/* Profile Card */}
                            <div className="h-full flex flex-col items-center p-3 bg-white p-3 border-t-4 border-green-400">
                                <div className="border border-gray-500 flex max-w-150 overflow-hidden sm:rounded-full">
                                    <img className="h-auto w-full mx-auto"
                                        src={clientDetail.logo?clientDetail.logo:userImg}
                                        alt=""/>
                                </div>
                                {/* <div className="h-40 w-40 overflow-hidden sm:rounded-full sm:relative sm:p-0 top-10 left-5 p-3">
                                    <img src="https://media.licdn.com/dms/image/C4D03AQH8qidO0nb_Ng/profile-displayphoto-shrink_800_800/0/1615696897070?e=2147483647&v=beta&t=ia3wfE2J7kVLdBy9ttkgUDAA_ul29fymykhQo0lABDo"/>
                                </div> */}
                                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{clientDetail? clientDetail.vendor.username:'...'}</h1>
                                {/* <h3 className="text-gray-600 font-lg text-semibold leading-6">Owner at Her Company Inc.</h3>
                                <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">Lorem ipsum dolor sit amet
                                    consectetur adipisicing elit.
                                    Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur non deserunt</p> */}
                            
                            </div>
                        </div>
                        {/* Right Side */}
                        <div className="w-full md:w-9/12">
                            {/* Profile tab */}
                            {/* About Section */}
                            <div className="h-full bg-white p-3 shadow-sm rounded-sm">
                                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-10">
                                    <span clas="text-green-500">
                                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <span className="tracking-wide">About</span>
                                </div>
                                <div className="text-gray-700">
                                    <div className="grid md:grid-cols-2 text-sm">
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Company name</div>
                                            <div className="px-4 py-2">{clientDetail.company_name}</div>
                                        </div>
                                        {/* <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Gender</div>
                                            <div className="px-4 py-2">Female</div>
                                        </div> */}
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Contact No.</div>
                                            <div className="px-4 py-2">{clientDetail.client.phone_number}</div>
                                        </div>
                                        {/* <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Current Address</div>
                                            <div className="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                                        </div> */}
                                        {/* <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Permanant Address</div>
                                            <div className="px-4 py-2">Arlington Heights, IL, Illinois</div>
                                        </div> */}
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Email.</div>
                                            <div className="px-4 py-2 whitespace-normal overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                                                {clientDetail.client.email}
                                                {/* <a className="text-blue-800" href="mailto:jane@example.com">jane@example.com</a> */}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2  font-semibold">User Role</div>
                                            <div className="px-4 py-2">{clientDetail.client.user_role}</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-wrap">
                                            <div className="px-4 py-2 font-semibold">Preferred location(Coordinates)</div>
                                            <div className="px-4 py-2 whitespace-normal overflow-x-auto" style={{ scrollbarWidth: 'none' }}>{clientDetail.area_of_preference?clientDetail.area_of_preference: "Not Provided"}</div>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                            {/* End of about section */}
                            <div className="my-4"></div>
                        </div>
                    </div>
                        <ul className="bg-white text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                            <li className="flex items-center py-3">
                                <span>Status</span>
                                <span className="ml-auto">
                                    <span className={`${clientDetail.client.is_active? "bg-green-500" : "bg-red-500"} py-1 px-2 rounded text-white text-sm`}>{clientDetail? clientDetail.client.is_active? "Active" : "Blocked" : "..."}</span>
                                </span>
                            </li>
                            <li className="flex items-center py-3">
                                <span>Member since</span>
                                <span className="ml-auto">{clientDetail.client.date_joined}</span>
                            </li>
                        </ul>
                </div>
            </div>
        )}
        </>
    )
}

export default VendorDetails
