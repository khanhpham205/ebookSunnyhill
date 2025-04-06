/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Head from 'next/head';
import Banner from '../components/banner'


import Link from 'next/link';
import { useEffect, useState } from "react";

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  // const fe = await fetch('http://localhost:9000/');
  const [books,setBooks] = useState<M_Book[]>([])
  const getbook=async()=>{
      const fe = await fetch(`${apiurl}/books`,{
          method:"GET"
      });
      const res = await fe.json()
      if(fe.ok){
          setBooks(res)
      }
  }
  useEffect(()=>{
    getbook()
  },[])
  return (<>
    <Head>
      <title>SunnyHill Ebook</title>
      <meta name="description" content="Đọc sách miễn phí cùng SunnyHill" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    

    <Banner/>
    <section className='gridsys' >
      <div className="fullcol mt-3 title">
        <h3>New Book</h3>
        <Link href='./book'>Xem thêm</Link>
      </div>
      {/* <h3 className='fullcol mt-3 title' >New Book <Link href='./book'>Xem thêm</Link></h3> */}
      {books?.map((e,i)=><Link className="book_card" href={`book/${e._id}`}>
            <img src={`${apiurl}/${e.img}`} alt="" />
            <h5>{e.name}</h5>
            <p>{e.catalog.name}</p>
        </Link>)}
    </section>
  </>);
}
