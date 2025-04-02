/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import Addbook from "./add.modals";
import Editbook from './edit.modals';
import useSWR from 'swr'
import { Fetcher } from 'swr'
import { toast } from 'react-toastify';


import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;


const handledeletebook = async(id:string)=>{
    const jwt = localStorage.getItem('JWT')
    const fe = await fetch(`${apiurl}/books/delete/${id}`,{
        method:"DELETE",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${ jwt }`,
        }
    })
    const res = await fe.json()
    if(fe.ok){
        toast.success('Xóa sách thành công')
    }else{
        toast.warning(res.error)
    }

}

const Bookpage = ()=>{
    const [book,setbook] = useState<M_Book>()
    const [books,setbooks] = useState<M_Book[]>([])
    const [showaddmodal,setshowaddmodal] = useState<boolean>(false)
    const [showupdatemodal,setshowupdatemodal] = useState<boolean>(false)

    async function fetchbooks(){
        const fe = await fetch('http://localhost:9000/books/',{
            method:'GET',
        });
        const res = await fe.json() 
        if(fe.ok){
            setbooks(res)            
        }
    }
    
    useEffect(() => {
        fetchbooks()
    }, []);
    return(<>
        <Addbook
            ShowModel={showaddmodal} 
            setShowModel={setshowaddmodal}
        />
        <Editbook
            ShowUpdateModel={showupdatemodal} 
            setShowUpdateModel={setshowupdatemodal}
            book={book}
        />
        <h2>Books</h2>
        <hr />
        <button
            className='admin_bt_add'
            onClick={()=>{setshowaddmodal(true)}}
        >Add</button>
        {books?.map((e,i)=>{
           
            return(<div className='admin_book_card'>
                <img src={`http://localhost:9000/${e.img}`}/>
                <div className="admin_book_card_info">
                    <h3>{e.name}</h3>
                    <p>{e.catalog.name}</p>
                </div>
                <div className="handle">

                    <Button>View</Button>
                    <Button
                        onClick={()=>{
                            setshowupdatemodal(true)
                            setbook(e)
                        }}
                    >Edit</Button>
                    <Button variant="outline-danger" onClick={()=>{
                        handledeletebook(e._id)
                    }}>Delete</Button>
                </div>
            </div>)
        })}
    </>)
}
export default Bookpage

