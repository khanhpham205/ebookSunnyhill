/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from '../Authcontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FaSearch } from "react-icons/fa";

import Link from "next/link";
import HighlightText from "./highlighttext";

import dotenv from 'dotenv';
import { Button } from "react-bootstrap";
import { log } from "console";
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;


function removeVietnameseTones(str:string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
}




function highlightMatchedWords(name:string, name_unsigned:string, userInput:string) {
    const rawWords = userInput.trim().toLowerCase().split(/\s+/);
    const keywords = rawWords.map(removeVietnameseTones);
  
    // Match từng từ không dấu trong unsigned title
    let unsigned = name_unsigned;
    let original = name;
  
    // Danh sách đoạn để hiển thị: [{ text, highlight }]
    const result = [];
    let lastIndex = 0;
    for (const keyword of keywords) {
        const matchIndex = unsigned.indexOf(keyword, lastIndex);
        if (matchIndex === -1) continue;
    
        // Ước lượng vị trí tương ứng trong chuỗi gốc
        const pre = unsigned.slice(lastIndex, matchIndex);
        const preLen = pre.length;
        const matchLen = keyword.length;
    
        // Tính vị trí tương ứng trong chuỗi gốc (gần đúng)
        const origStart = lastIndex + (original.slice(lastIndex).indexOf(pre) || 0) + preLen;
        const origEnd = origStart + matchLen;
    
        // Push đoạn trước match
        if (origStart > lastIndex) {
            result.push({ text: original.slice(lastIndex, origStart), highlight: false });
        }
    
        // Push đoạn match
        result.push({ text: original.slice(origStart, origEnd), highlight: true });
    
        // Cập nhật lại vị trí
        lastIndex = origEnd;
    }
  
    // Push phần còn lại sau match cuối
    if (lastIndex < original.length) {
        result.push({ text: original.slice(lastIndex), highlight: false });
    }
  
    return result;
}




const Header = () => {
    const { isLoggedIn,isadmin, logout } = useAuth();
    
    const [search,setsearch] = useState<string>('')
    const [suggestions, setSuggestions] = useState<M_Book[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
          setDebouncedQuery(search);
        }, 900);
    
        return () => clearTimeout(timeout); // clear khi gõ tiếp
    }, [search]);

    useEffect(() => {
        if (!debouncedQuery) {
            setSuggestions([]);
            return;
        }
    
        const fetchSuggestions = async () => {
            const fe = await fetch(`${apiurl}/books/search?searchname=${encodeURIComponent(debouncedQuery)}`);
            const res = await fe.json();
            setSuggestions(res);
            // console.log(suggestions);
            
        };
    
        fetchSuggestions();
      }, [debouncedQuery]);
    
    const [catas,setcatas] = useState<M_Catalog[]>([])

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
    },[])

    const closebkli = ()=>{
        document.getElementById('bookdt')!.removeAttribute("open");
    }

    return (
        <>
            <nav className="gridsys">
                <Link href={"/"} className='sunnyhilllogo' style={{ gridColumn: "1/3" }}><img src="/images/logo.png" alt="logo"/></Link>
                
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

                <a href="https://docs.google.com/forms/d/e/1FAIpQLSch4uW7lNtBMqBkqT2wusYIw7Xjzzm1CWYuFhzkm9iJz7M7gQ/viewform">Góp ý</a>
            
                {(isadmin) ? <Link  href={"../admin"}>admin</Link>: <></> }

                    
                <div className="re_searchbox"
                    style={{gridColumn:'span 2'}}
                >
                    
                    <input 
                        type="text" 
                        id='search_box' 
                        name='searchname' 
                        placeholder="Search book..."
                        value={search}
                        onChange={(e) => setsearch(e.target.value)}
                    />
                    <FaSearch className="searchicon" onClick={(e)=>{}} />
                    {(suggestions.length>=1)?<div>
                        {suggestions.map((e,i)=>{
                            return (
                            <Link href={`../book/${e._id}`} 
                                className="re_search"
                                onClick={()=>{
                                    setsearch('')
                                    setDebouncedQuery('')
                                    setSuggestions([])
                                }}
                            >
                                <img src={`${apiurl}/${e.img}`} alt=""/>
                                <div className="content">
                                    <HighlightText
                                        name={e.name}
                                        name_unsigned={e.name_unsigned}
                                        userInput={search}
                                    />
                                    <p>{e.catalog.name}</p>
                                </div>
                            </Link >)
                        })}
                    </div>:<></>}
                </div>

                

                {(isLoggedIn) ? <p className='regis'><Button onClick={logout} >Logout</Button>

                </p> : <Link className='regis' href={"../register"}>Resister</Link>}
            </nav>
        </>
    );
};

export default Header