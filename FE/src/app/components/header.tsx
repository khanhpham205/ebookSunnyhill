/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import Link from "next/link";


const Header = () => {
    const router = useRouter();
    const navstyle = {
        height: "80px",
        backgroundColor: "#272727",
        display: "grid",
        gridTemplateColumns: "repeat(12,80px)",
        gap: "20px",
        justifyContent: "center",
        alignItems:'center'
    };

    const [isadmin,setisadmin] = useState<boolean>(false)
    const [user,setuser] = useState<string>(' ')

    const checkuser = async()=>{
        try {
            const jwt = localStorage.getItem('JWT')
            const fe = await fetch('http://localhost:9000/users/check',{
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
    useEffect(()=>{
        checkuser()
    },[])

    
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
                
                <Link href={"../book"}>book</Link>
                {(isadmin) ? <Link  href={"../admin"}>admin</Link>: <></> }
                {(user.length > 1) ? <p style={{gridColumn:'11/13'}}>{user}</p> : <Link style={{gridColumn:'11/13'}} href={"../register"}>Resister</Link>}
            </nav>
        </>
    );
};

export default Header