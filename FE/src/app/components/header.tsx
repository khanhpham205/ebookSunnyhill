/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Dropdown from 'react-bootstrap/Dropdown';

import Link from "next/link";

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;


const Header = () => {
    const router = useRouter();

    const [isadmin,setisadmin] = useState<boolean>(false)
    const [user,setuser] = useState<string>(' ')
    
    const [catas,setcatas] = useState<M_Catalog[]>([])

    const checkuser = async()=>{
        try {
            const jwt = localStorage.getItem('JWT')
            const fe = await fetch(`${apiurl}/users/check`,{
                method:"GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            })
            const res = await fe.json()
            if(fe.ok && res.data.userId){
                setuser(`Welcome ${res.data.name}`)

                if(res.data.role == 1){
                    setisadmin(true)
                }
            }
        } catch (error) {throw error}
    }
    const getcata = async()=>{
        try {
            const jwt = localStorage.getItem('JWT')
            const fe = await fetch(`${apiurl}/catalogs`,{
                method:"GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const res = await fe.json()
            if(fe.ok){
                setcatas(res)
            }
        } catch (error) {throw error}
    }
    useEffect(()=>{
        getcata()
        checkuser()
    },[])

    const closebkli = ()=>{
        document.getElementById('bookdt')!.removeAttribute("open");

    }

    
    return (
        <>
            <nav className="gridsys">
                <button
                    style={{ gridColumn: "span 2" }}
                    type="button"
                    onClick={() => router.push("/")}
                >
                    Home
                </button>
                
                <details id='bookdt'>
                    <summary>Books</summary>
                    <div id="bookbycata">
                        <Link href={"../book"} onClick={closebkli}>All books</Link>
                        <hr/>
                        {catas.map((e,i)=>{
                            return<Link 
                                onClick={closebkli} 
                                href={`../book?catalog=${e._id}`}
                                >{e.name}</Link>
                        })}
                    </div>
                </details>
                

                {(isadmin) ? <Link  href={"../admin"}>admin</Link>: <></> }

                {(user.length > 1) ? <p style={{gridColumn:'11/13'}}>{user}</p> : <Link style={{gridColumn:'11/13'}} href={"../register"}>Resister</Link>}
            </nav>
        </>
    );
};

export default Header