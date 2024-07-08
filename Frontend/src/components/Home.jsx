//import React from 'react'

import { useState } from "react";

import axios from "axios";


function Home() {
    const[selectedfile,setselectedfile]=useState(null)
    const[convert,setconvert]=useState("")
    const[DownloadError , setDownloadError] = useState("")
    

    const handleFileChange =(e) =>{
        setselectedfile(e.target.files[0])
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!selectedfile){
            setconvert("Please select a file");
            return;
        }
    const formData = new FormData()
    formData.append("file",selectedfile)
    try {
        const response = await axios.post("http://localhost:3000/convertfile" , formData,{
            responseType: "blob",
        }) ;
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link=document.createElement("a")
        link.href=url;
        link.setAttribute("download", selectedfile.name.replace(/\.[^/.]+$/,"")+".pdf")
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        setselectedfile(null)
        setDownloadError("")
        setconvert("File converted succesfully")


    } catch (error) {
        console.log(error);
        if(error.response && error.response.status==400){
            setDownloadError("Error occurred:", error.response.data.message)
        }else{
            setconvert("");
        }
    }
    }
  return (
    <>
    <div className="max-w-screen-2xl mx-auto container px:6 md:px-40">
        <div className="flex h-screen items-center justify-center">
             <div className="border-2 border-dashed px-4 py-2 md:px-8 border-indigo-400 rounded-lg shadown-1">
                <h1 className="text-3xl font-bold text-center mb-4">Convert Word to pdf Online</h1>
                <p className="text-sm text-center mb-5">
                    Easily convert word documetns to pdf format online,without having to install any software.
                </p>
            
             <div className="flex flex-col items-center space-y-4">
                <input type="file" accept=".doc,.docx" className="hidden" id="FileInput" onChange={handleFileChange}/>
                <label htmlFor="FileInput" className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300">
                📁
                    <span className='text-2xl mr-2 hover:text-white' >{ selectedfile ? selectedfile.name : "CHOOSE FILE" }</span>
                </label>
                <button onClick={handleSubmit} disabled={!selectedfile} className="text-white disabled:bg-gray-400 disabled:pointer-events-none  bg-blue-500 hover:bg-blue-700 duration-300 font-bold px-4 py-2 rounded-lg">Convert file</button>
                {convert && ( <div className="text-green-500 text-center">{convert}</div>)}
                {DownloadError && ( <div className="text-red-500 text-center">{DownloadError}</div>)}
                </div>
             </div>
        </div>
    </div>
    </>
  )
}

export default Home