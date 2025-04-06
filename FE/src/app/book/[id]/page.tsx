/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */

"use client";
// "use server";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { use } from "react";
// import { toast } from "react-toastify";
import dotenv from 'dotenv';
import Head from "next/head";
import { string32 } from "pdfjs-dist/types/src/shared/util";

interface Paper{
    paper:number,
    f:string | undefined,
    b:string | undefined
}

dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;

export default function PdfToImage({ params }: { params: Promise<{ id: string }> }) {
    const id = use(params).id;
    
    const [imagesArray,setimagesArray] = useState<string[]>([]); 
    const [book1, setBook1]             = useState<Paper[]>([]); 
    const [currentpage, setcurrentpage] = useState<number>(1);
    const [max, setmax]                 = useState<number>(0);
    const [isloaded, setisloaded]       = useState<boolean>(true);
    let maxpdfpage = 0

    const init = async()=>{
        if (imagesArray.length === 0) {
            const fe = await fetch(`${apiurl}/books/bookjson/${id}`)
            const res= await fe.json()
            if(fe.ok){
                setimagesArray(res.pages)
                const tmpbk: Paper[] = [];

                for (let i = 0; i < res.pages.length; i += 2) {           
                    if (i + 1 <= res.pages.length) {
                        tmpbk.push({
                            paper: i,
                            f: res.pages[i],
                            b: res.pages[i + 1] || ''
                        });
                    }
                }
                setmax(tmpbk.length)
                setBook1(tmpbk);
                console.log(tmpbk);
                
                setisloaded(false);
            }
        }
    }

    useEffect(() => {
        init()
    }, [imagesArray]);


    const handlenextpage = ()=>{
        if(currentpage==max){return;}
        const pa = document.getElementById(`page${currentpage}`)
        const papre = document.getElementById(`page${currentpage-1}`)
        setcurrentpage(per=>per+1)

        if(currentpage==1){document.getElementById('bookpage')!.style.transform = 'translateX(50%)'}
        if(currentpage == max-1 && maxpdfpage%2 ==1){
            document.getElementById('bookpage')!.style.transform = 'translateX(100%)'
            // if(maxpdfpage%2 ==1){
            // }
        }
        if(pa){pa!.classList.add('flipped')}
        if(papre){papre!.style.zIndex = String(0);}
    }
    const handleprepage = ()=>{
        if(currentpage==1){return;}
        const pa = document.getElementById(`page${currentpage}`)
        const papre = document.getElementById(`page${currentpage-1}`)
        
        setcurrentpage(per=>per-1)
        if(currentpage == 2){
            setcurrentpage(1)
            document.getElementById('bookpage')!.style.transform = 'translateX(0)'
        }
        if(currentpage == max){
            document.getElementById('bookpage')!.style.transform = 'translateX(50%)'
        }
        papre!.classList.remove('flipped')
        papre!.style.zIndex = String(Number(pa!.style.zIndex) + 1)
    }


    return (<>
        <Head><title>Đọc sách Ebook</title></Head>
        <section className="pagereadbook">

            <div className="loadding" hidden={!isloaded}>
                <img src="/animation.gif" alt="" id='loadinganimation'/>
                <h3>Page is loadding</h3>
                <h4>Please wait</h4>
            </div>

            
            <section 
                id='bookpage'
                className='book m-4'
            >
                {book1.map((e,i)=>{
                    const numpa = `page${i+1}`
                    if(e.b == undefined){
                        return(<>
                            <div 
                                key={i}
                                className='paper'
                                style={{zIndex:book1.length-i}}
                                id={numpa}
                            >
                                <div className='front'>
                                    <div className="front-content">
                                        <img src={e.f} alt="" />
                                    </div>
                                    <img className="front-content" src={e.f} alt="" />
                                </div>
                            </div>
                        </>)
                    }
                    return(
                        <div 
                            className='paper'
                            style={{zIndex:book1.length-i}}
                            id={numpa}
                            key={i}
                        >
                            <div className='front'>
                                <img className="front-content" src={e.f} alt="" />
                            </div>
                            <div className='back'>
                                <img className="back-content" src={e.b} alt="" />
                            </div>
                        </div>
                    )})
                }
            </section>

            <div className="bookhandle">
                <Button 
                    onClick={handleprepage}
                    id='buttonpre'
                    disabled={isloaded}
                >
                    Prev
                </Button>
                <p>{currentpage} / {max}</p>
                <Button 
                    onClick={handlenextpage}
                    id='buttonnext'
                    disabled={isloaded}
                >
                    Next
                </Button>
            </div>
        </section>
    </>);
};