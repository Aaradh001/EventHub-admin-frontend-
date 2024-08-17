import React, { useEffect, useRef, useState } from 'react'
import FormInput2 from '../common/FormInput2';
import axios from 'axios';
import { BASE_URL } from '../../constants/constants';
import { VENUE_INPUTS } from '../../assets/formInputData/venue management/updateFormInputs';
import { TError, TSuccess } from '../../components/Toastify';
import { useParams } from 'react-router-dom';
import Loader from '../common/Loader';

const VenueDetails = () => {
    const inputs = VENUE_INPUTS;
    const baseURL = BASE_URL;
    const token = localStorage.getItem("access");
    const [showDropdown, setShowDropdown] = useState(false)
    const { venueId } = useParams();
    const venueCaptionRef = useRef("");
    const venueImageRef = useRef(null);
    const [VenueImage, setVenueImage] = useState([])
    const [isLoading, setIsLoading] = useState(true);
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

    function handleCaptionChange(e) {
        console.log("working");
        if (e.target.value && !showDropdown) {
            setShowDropdown(true)
        }
        else if (!e.target.value) {
            setShowDropdown(false)
        }
    }

    function handleImageDrag(e) {
        console.log('hkgfgasdfhghfghmnawvfjh');
        // console.log(e.target.files);

        if (e.target.files[0]) {
            const image = venueImageRef.current.files[0]
            const caption = venueCaptionRef.current.value
            if (VenueImage.find((file) => file.caption === caption || file.image.name === image.name)) {
                TError("Enter a different caption or image")
                venueCaptionRef.current.value = ""
                venueImageRef.current.value = null
                setShowDropdown(false)
                return
            }
            setVenueImage((prev) => ([...prev, {
                id: new Date().getMilliseconds(),
                image: image,
                caption: caption
            }]))
            venueCaptionRef.current.value = ""
            venueImageRef.current.value = null

            setShowDropdown(false)
        }
    }

    function removeSelectedImage(e, id) {
        setVenueImage((prev) => (prev.filter((item) => !(item.id === id))))
    }

    async function handleImageSubmit(e) {
        e.preventDefault();
        const formData = new FormData()
        VenueImage.forEach((item, index) => {
            formData.append(item.caption, item.image);
        });
        formData.append("venue_id", venueDetails.id)
        
        try {
            await axios.post(baseURL + `admin-control/venue-management/venue-images/`, formData, {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log("from image submission  :", res);
                    setVenueImage([])
                    setVenueDetails((prev) => {
                        const updatedImages = prev.images.concat(res.data)
                        return { ...prev, images: updatedImages };
                    })
                    TSuccess("Images Added !!")
                });
            } catch (error) {
            console.error('Failed to upload images:', error);
        }
    }

    useEffect(() => {
        fetchVenueData(baseURL + `admin-control/venue-management/venue/${venueId}/`);
    }, []);

    return (
        <>
            {isLoading ? <Loader /> : (
                <section className="bg-white mt-14 ml-14 pl-28 md:ml-64 dark:bg-gray-900">
                    <div className=''>
                        <div className=" px-4 py-8 lg:py-16 w-full max-w-6xl">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update Venue</h2>
                            <div className='flex flex-col lg:flex-row gap-10 w-full lg:justify-between'>
                                <div className='w-full md:w-3/5'>
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
                                <div className='w-full lg:w-2/5'>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Venue images</h2>
                                    <div className="overflow-y-auto bg-black border-8 border-black py-1 px-4 rounded-lg overflow-x-hidden h-full max-h-96">
                                        {!venueDetails.images.length && <div className="p-3 h-24 bg-gray-800 text-red-500 text-md uppercase ">No images to show</div>}
                                        {venueDetails.images.map((image, index) => (
                                            <div key={index} className="p-3 bg-gray-100 mb-5 rounded-lg border dark:bg-gray-800 ">
                                                <h2 className='m-2 font-semibold text-lg uppercase' >{image.caption}</h2>
                                                <div className='flex justify-start w-full'>

                                                    <div className="w-3/5 md:w-28 md:h-28  mx-2 my-2">
                                                        <img 
                                                            className="w-full h-full rounded-full transform hover:scale-110 hover:rounded-md transition-all duration-200 ease-in-out" 
                                                            src={image.image.includes(baseURL) ? image.image : baseURL+image.image} 
                                                            // src={image.image} 
                                                            alt="" />
                                                    </div>
                                                    <div className="mx-2 w-2/5 my-auto ">
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
                                    <div className="w-full max-w-3xl my-4 mx-auto">
                                        <h2 className="my-4 text-xl font-bold text-gray-900 dark:text-white">Add images</h2>
                                        <form onSubmit={handleImageSubmit}>

                                            <div className="h-full">
                                                <div className="p-3 dark:bg-gray-800 mb-4">
                                                    <h2 className='m-2 font-semibold text-lg uppercase' ></h2>
                                                    <div className='flex gap-10 flex-col justify-start w-full'>
                                                        <div className=''>
                                                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="caption"> Image for</label>
                                                            <input type="text" id='caption' ref={venueCaptionRef} onChange={(e) => handleCaptionChange(e)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500' placeholder='Image for..' />

                                                        </div>
                                                        {/* <div className="w-3/5 md:w-28 md:h-28 mx-2 my-2">
                                                        <img className="w-full h-full" src="" alt="" />
                                                    </div>
                                                    <div className="my-2 mx-2 w-2/5 my-auto ">
                                                        <input
                                                            type="file"
                                                            // onChange={(e) => handleImage(e, image.id)}
                                                            className="overflow-x-auto"
                                                            id="{`image${index}`}"
                                                            name="{`image${index}`}"
                                                            accept=".jpg,.jpeg,.WEBP,.png"
                                                        />
                                                    </div> */}

                                                        <div className={`${!showDropdown && "hidden"} flex items-center justify-center w-full`}>
                                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                    </svg>
                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                </div>
                                                                <input id="dropzone-file" ref={venueImageRef} onChange={handleImageDrag} type="file" name='' className="hidden" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ border: '15px solid rgb(31 41 55)' }} className='p-3  dark:border-gray-500 rounded-lg bg-gray-200 dark:bg-gray-900 h-full md:min-h-32 md:max-h-64 overflow-y-auto overflow-x-hidden'>
                                                    {VenueImage.length ? VenueImage.map((file, index) => (
                                                        <div key={index} className='bg-gray-500 px-2 py-1 my-3 rounded-lg hover:shadow-md flex justify-between items-center hover:shadow-white'>
                                                            <span>{`${file.caption} - ${file.image?.name ?? ""}`}</span>
                                                            <button type='button' onClick={(e) => removeSelectedImage(e, file.id)} className='p-1 w-8 h-8 hover:bg-gray-100 hover:text-black rounded-md'>x</button>
                                                        </div>
                                                    )) : "No files selected"}
                                                </div>
                                            </div>
                                            <div className="flex items-center my-4 space-x-4">
                                                <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                    Add Images
                                                </button>
                                            </div>
                                        </form>
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
