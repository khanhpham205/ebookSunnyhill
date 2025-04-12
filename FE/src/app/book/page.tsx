/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSearchParams } from 'next/navigation';

import Button from "react-bootstrap/Button";
import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

import { log } from "console";
import Head from "next/head";
import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;

const Bookspage=()=>{
    const [books, setBooks]= useState<M_Book[]>([]); 

    const searchParams = useSearchParams()
    const catalog = searchParams.get("catalog")

    const handlesort=(type:string)=>{
        const sortedBooks = [...books];
        switch (type) {
            case "A-Z":
                sortedBooks.sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên A-Z
                break;
            case "Z-A":
                sortedBooks.sort((a, b) => b.name.localeCompare(a.name)); // Sắp xếp theo tên Z-A                
                break;
            default:
                break;
        }
        setBooks(sortedBooks);    
    }

    useEffect(() => {
        const getbook = async () => {
            let a = ''
            if (catalog) {
                a = `?catalog=${catalog}`
            }
            const fe = await fetch(`${apiurl}/books${a}`, {
                method: "GET"
            });
            const res = await fe.json()
            if (fe.ok) {
                setBooks(res)
            }
        }
    
        getbook()
    }, [catalog]);

    return (<>
        <Head><title>SunnyHill Admin</title></Head>
        <section className="bookspage gridsys">
            <h2 style={{gridColumn:'1/4'}}>Book page</h2>
            <select id='sorttag' onChange={(e)=>{
                handlesort(e.target.value)               
            }}>
                <option disabled selected>Sort by: </option>
                <option value="A-Z" >A-Z</option>
                <option value="Z-A" >Z-A</option>
            </select>
            <hr style={{margin:0}} />
            {books?.map((e,i)=>{
                return(<Link className="book_card" href={`book/${e._id}`}>
                    <img src={`${apiurl}/${e.img}`} alt="" />
                    <h5>{e.name}</h5>
                    <p>{e.catalog.name}</p>
                </Link>)
                // return(<Link className="book_card" href={`${apiurl}/${e.file}`}>
                //     <img src={`${apiurl}/${e.img}`} alt="" />
                //     <h4>{e.name}</h4>
                // </Link>)
            })}
        </section>

    </>);
};

export default Bookspage