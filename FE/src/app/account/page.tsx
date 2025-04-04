/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import Button from "react-bootstrap/Button";
import Image from 'next/image'

import { useEffect, useState } from "react";
import { log } from "console";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;

const Register:React.FC=()=>{


    return (<>
        <section className="gridsys">
            <div className="" style={{gridColumn:'1/3'}}>handle</div>
            <div className="" style={{gridColumn:'3/13'}}>page</div>
        </section>
    </>);
};

export default Register


