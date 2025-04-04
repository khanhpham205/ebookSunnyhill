/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Button from "react-bootstrap/Button";
import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from "react";
import { log } from "console";
import Head from "next/head";

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;

const Bookspage=()=>{
    const [books, setBooks]= useState<M_Book[]>([]); 
    const [issort, setissort]= useState<boolean>(false); 
    // const [currentpage, setcurrentpage] = useState<number>(1);
    
    const getbook=async()=>{
        const fe = await fetch(`${apiurl}/books`,{
            method:"GET"
        });
        const res = await fe.json()
        if(fe.ok){
            setBooks(res)
        }
    }


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
        getbook()
    }, []);

    return (<>
        <section className="bookspage gridsys">
            <h2 style={{gridColumn:'1/10'}}>Book page</h2>
            <select style={{gridColumn:'11/13'}} onChange={(e)=>{
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
                    <h4>{e.name}</h4>
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