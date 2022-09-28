/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

export default function Dropdown() {

    const [toggle, setSetToggle] = useState(false);

    const controlToggle = () =>{
        setSetToggle((prevState) => !prevState);
    }
    return (
        <div>
            <div className="relative inline-block text-left">
                <div>
                    <button onClick={()=>controlToggle()} type="button" className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 bg-gray-200 rounded hover:bg-indigo-500 hover:text-indigo-100" aria-expanded={toggle} aria-haspopup={toggle}>

                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>


                <div style={{ display:`${toggle ? 'block' : 'none'}` }} className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" aria-orientation="vertical">
                    <div className="py-1">
                        
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm" id="menu-item-1">Support</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm" id="menu-item-2">License</a>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
