/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Banner from './components/banner'
// import useSWR from 'swr'
// import { Fetcher } from 'swr'
import dotenv from 'dotenv';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
    <Banner/>
    <embed src={`${apiurl}/${books[0]?.file}`} type="" />
    
    asdasd
  </>);
}
