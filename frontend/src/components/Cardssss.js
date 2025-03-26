import React from 'react'
import { MdOutlineFoodBank } from "react-icons/md";

const Card = () => {
  return (
    <div className='flex w-[600px] h-[300px] bg-red-400 '>
        <div className='w-1/2'>

        </div>
        <div className=' w-1/2 bg-red-500 rounded-md flex flex-col justify-center items-center'>
            <div>
            <MdOutlineFoodBank size={100} color='white'/>
            </div>
            <div>
                <span className='text-4xl text-white'>IIITG MESS</span>
            </div>
         
         

        </div>
    </div>
  )
}

export default Card;