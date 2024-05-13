import React from 'react'
import "../../assets/styles/loaderStyle.css"

const Loader = () => {
  return (
    <div className='relative h-screen  md:ml-64 flex justify-center items-center'>
        <div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>
    </div>
  )
}

export default Loader
