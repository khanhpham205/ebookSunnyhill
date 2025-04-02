/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import useSWR from 'swr'
import { Fetcher } from 'swr'
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";

import AddCata from "./add.modals";
import EditCata from './edit.modals';
import { toast } from 'react-toastify';

const Catalogpage = ()=>{
    const [showaddmodal,setshowaddmodal] = useState<boolean>(false)
    const [showupdatemodal,setshowupdatemodal] = useState<boolean>(false)
    // const [catas,setcatas] = useState<M_Catalog[]>([])
    const [cata,setcata] = useState<M_Catalog>()

    const fetcher: Fetcher<M_Catalog[]> = (url:string)=>fetch(url).then(e=>e.json())
    const {data,error, isLoading} = useSWR(
        `http://localhost:9000/catalogs`,
        fetcher,
        {
        revalidateIfStale: true,
        revalidateOnFocus:false,
        revalidateOnReconnect: false,
        }
    )

    

    const deletehandle = async(id:string)=>{
        const jwt = localStorage.getItem('JWT')

        
        const fe = await fetch(`http://localhost:9000/catalogs/delete/${id}`,{
            method:"DELETE",
            headers:{
                authorization: `Bearer ${jwt}`,
            }
        })
        const res = await fe.json()
        if(fe.ok){
            toast.success('Xóa danh mục thành công')
        }else{
            toast.warning(res.error)
        }
    } 



    return(<>
        <h2>Catalogs</h2>
        <hr />
        <button 
            className='admin_bt_add'
            onClick={()=>{setshowaddmodal(true)}}
        >Add</button>
        <AddCata 
            ShowModel={showaddmodal} 
            setShowModel={setshowaddmodal}
        />
        <EditCata 
            ShowUpdateModel={showupdatemodal} 
            setShowUpdateModel={setshowupdatemodal}
            cata = {cata}
        />
        {data?.map((e,i)=>{
            return(
                <div className='admin_cata'>
                    <h4>Name: {e?.name}</h4>
                    <p>Desc: {e?.desc}</p>
                    <p>Số sách: {e?.countbook}</p>
                    <div className="handle">
                        <Button variant="primary"
                            onClick={()=>{
                                setcata(e)
                                setshowupdatemodal(true)
                            }}
                        >Edit</Button>
                        <Button variant="outline-danger"
                            onClick={()=>{
                                deletehandle(e?._id)
                            }}
                        >Delete</Button>
                    </div>
                </div>
            )
        })}
    </>)
}
export default Catalogpage

