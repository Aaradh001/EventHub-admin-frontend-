import React, { useEffect, useRef, useState } from 'react'
import FormInput2 from '../common/FormInput2';
import axios from 'axios';
import { BASE_URL } from '../../constants/constants';
import { VENUE_INPUTS } from '../../assets/formInputData/venue management/updateFormInputs';
import { TError, TSuccess } from '../../components/Toastify';
import { useParams } from 'react-router-dom';
import Loader from '../common/Loader';

const VenueDetails = () => {
    const { venueId } = useParams();


    const [venueDetails, setVenueDetails] = useState({
        id: "",
        name: "",
        capacity: "",
        management_company: "",
        rental_fees: "",
        reservation_status: "",
        full_address: "",
        add_line_1: "",
        add_line_2: "",
        lat_long: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        description: "",
        venue_type: "",
        amenities: [],
        all_amenities: [],
        reservation_choices: [],
        venue_type_choices: [],
        images: []
    });


    const [isLoading, setIsLoading] = useState(true);
    const inputs = VENUE_INPUTS;
    const baseURL = BASE_URL;
    const token = localStorage.getItem("access");
    const fetchVenueData = async (url) => {
        try {
            await axios.get(url, {
                headers: {
                    authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 500);
                    console.log("from VENUE DETAILS fetch", res);
                    setVenueDetails((prev) => ({
                        ...prev,
                        id: res.data.id,
                        name: res.data.name,
                        capacity: res.data.capacity,
                        management_company: res.data.management_company,
                        rental_fees: res.data.rental_fees,
                        add_line_1: res.data.add_line_1,
                        add_line_2: res.data.add_line_2,
                        lat_long: res.data.lat_long,
                        street: res.data.street,
                        city: res.data.city,
                        state: res.data.state,
                        country: res.data.country,
                        pincode: res.data.pincode,
                        description: res.data.description,
                        venue_type: res.data.venue_type,
                        reservation_status: res.data.reservation_status,
                        amenities: res.data.amenities,
                        all_amenities: res.data.all_amenities,
                        reservation_choices: res.data.reservation_choices,
                        venue_type_choices: res.data.venue_type_choices,
                        images: res.data.images
                        // isVerified: res.data.is_verification_completed
                    })
                    )
                });
        } catch (error) {
            TError("Data fetching failed !!")
            console.log("the error is  :", error);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let url = baseURL + `admin-control/venue-management/venue/${venueDetails.id}/`;
        axios.put(url, venueDetails, {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    TSuccess("Profile updated successfully");
                }
            })
            .catch((err) => {
                console.log(err);
                TError("Updation failed !!!")
                console.log(err.response.data);
            });
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        name === "amenities" ? (
            setVenueDetails((prevData) => ({
                ...prevData,
                [name]: venueDetails.all_amenities.filter(amenity => Array.from(event.target.selectedOptions, option => parseInt(option.value)).includes(amenity.id)),
            }))
        ) : (
            setVenueDetails((prevData) => ({
                ...prevData,
                [name]: event.target.value,
            }))
        )
    };
    async function handleImage(e, imageId) {
        // const imageFile = imageInputRef.current.files[0];
        e.preventDefault();
        const formData = new FormData()
        formData.append('image', e.target.files[0]);
        formData.append('venue_id', venueDetails.id);
        try {
            await axios.put(baseURL + `admin-control/venue-management/venue-image/${imageId}/`, formData, {
                headers: {
                    authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log("from image  :", res);
                    TSuccess("Image updated !!")
                    setVenueDetails((prev) => {
                        const updatedImages = prev.images.map(image =>
                            image.id === res.data.id ? { ...image, image: res.data.image } : image
                        );

                        return { ...prev, images: updatedImages };
                    }
                    )



                });
        } catch (error) {
            console.log("the error is  :", error);
        }
        // if(!imageFile){
        //     TError("Image not selected !!")
        //     return
        // }


    }
    console.log("the state is   :", venueDetails)



    useEffect(() => {
        fetchVenueData(baseURL + `admin-control/venue-management/venue/${venueId}/`);
        // eslint-disable-next-line
    }, []);


    return (
        <>
            {isLoading ? <Loader /> : (
                <section className="bg-white mt-14 ml-14 pl-28 md:ml-64 dark:bg-gray-900">
                    <div className=''>
                        <div className=" px-4 py-8 lg:py-16 w-full max-w-6xl">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update Venue</h2>
                            <div className='flex flex-col lg:flex-row gap-10 w-full lg:justify-between'>
                                <div className='w-full md:w-2/3'>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-4 mb-4 sm:grid-cols-3 sm:gap-6 sm:mb-5">

                                            {inputs.map((input) => {
                                                return (
                                                    <FormInput2
                                                        key={input.keyId}
                                                        {...input}
                                                        value={venueDetails[input.name]}
                                                        onChange={handleInputChange}
                                                    />
                                                );
                                            })}

                                            <div>
                                                <label htmlFor="reservation_status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reservation Status</label>
                                                <select
                                                    id="reservation_status"
                                                    name='reservation_status'
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    value={venueDetails.reservation_status || ""}
                                                    onChange={(e) => handleInputChange(e)}
                                                >
                                                    <option value="">Select</option>
                                                    {venueDetails.reservation_choices.map((choice, index) =>
                                                        <option
                                                            key={index}
                                                            value={choice}
                                                        >
                                                            {choice}
                                                        </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className=''>
                                                <label htmlFor="venue_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Venue Type</label>
                                                <select
                                                    id="venue_type"
                                                    name='venue_type'
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    value={venueDetails.venue_type || ""}
                                                    onChange={(e) => handleInputChange(e)}
                                                >
                                                    <option value="">Select</option>
                                                    {venueDetails.venue_type_choices.map((choice, index) =>
                                                        <option
                                                            key={index}
                                                            value={choice}
                                                        >
                                                            {choice}
                                                        </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className='sm:col-span-3'>
                                                <label htmlFor="amenities" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amenities</label>
                                                <select
                                                    id="amenities"
                                                    multiple
                                                    name='amenities'
                                                    className="bg-gray-50 h-28 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    value={venueDetails.amenities.map(amenity => amenity.id) || []}
                                                    onChange={(e) => handleInputChange(e)}
                                                >
                                                    {venueDetails.all_amenities.length ? venueDetails.all_amenities?.map((amenity, index) => (
                                                        <option className="px-2 py-1 my-1 rounded-md" key={index} value={amenity.id}>{amenity.name}</option>
                                                    )) : (
                                                        <option disabled className="px-1 py-2 bg-gray-100 rounded-sm" defaultValue={""} value="">No data</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                Update Venue
                                            </button>
                                            {/* <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                                <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                                Delete
                                            </button> */}
                                        </div>
                                    </form>
                                </div>
                                <div className='w-full lg:w-1/3 h-96'>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Venue images</h2>
                                    <div className="overflow-y-auto overflow-x-hidden h-full max-h-96">
                                        {!venueDetails.images.length && <div className="p-3 h-24 bg-gray-800 text-red-500 text-md uppercase ">No images to show</div>}
                                        {venueDetails.images.map((image, index) => (
                                            <div key={index} className="p-3 bg-gray-800 ">
                                                <h2 className='m-2 font-semibold text-lg uppercase' >{image.caption}</h2>
                                                <div className='flex justify-start w-full'>

                                                    <div className="w-3/5 md:w-28 md:h-28 mx-2 my-2">
                                                        <img className="w-full h-full" src={image.image} alt="" />
                                                    </div>
                                                    <div className="my-2 mx-2 w-2/5 my-auto ">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleImage(e, image.id)}
                                                            className="overflow-x-auto"
                                                            id={`image${index}`}
                                                            name={`image${index}`}
                                                            accept=".jpg,.jpeg,.WEBP,.png"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            )
            }
        </>

    )
}

export default VenueDetails
