/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
// "use server";
import Button from "react-bootstrap/Button";
import Image from 'next/image'

import { useEffect, useState } from "react";
import { getDocument } from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { use } from "react";
import { log } from "console";
import { setInterval } from "timers/promises";
import { useRouter } from 'next/navigation';
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"; // Cấu hình worker

interface Paper{
    paper:number,
    f:string | undefined,
    b:string | undefined
}

import dotenv from 'dotenv';
import { toast } from "react-toastify";
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;
// export default function PdfToImage({params}: {params: { id: string }}) {
export default function PdfToImage({ params }: { params: Promise<{ id: string }> }) {
    const id = use(params).id;
    // console.log(id);
    
    
    const router = useRouter();
    const [imagesArray,setimagesArray] = useState<string[]>([]); 
    const [book1, setBook1]             = useState<Paper[]>([]); 
    const [currentpage, setcurrentpage] = useState<number>(1);
    const [max, setmax]                 = useState<number>(0);
    const [isloaded, setisloaded]       = useState<boolean>(true);
    const [pdfpath, setpdfpath]         = useState<string>('');
    const [ia, setia]         = useState<string>('');
    let maxpdfpage = 0

    const renderPdfToImages = async (path:string) => {
        // https://cors-anywhere.herokuapp.com/
        // const response = await fetch(path);
        const pdff = await fetch(`https://cors-anywhere.herokuapp.com/${path}`)
        const blob = await pdff.blob();
        const url = URL.createObjectURL(blob);
        // const pdf = await getDocument(url).promise;
        const pdf = await getDocument(url).promise;

        // const pdf = await getDocument(path).promise;
        maxpdfpage=pdf.numPages;
        const tmpbk: Paper[] = [];
        console.log(pdf);

        if(imagesArray.length === 0){
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const viewport = page.getViewport({ scale: 1 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d")!;
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;

                const dataUrl = canvas.toDataURL();
                if(!imagesArray.includes(dataUrl)){ imagesArray.push(dataUrl); }
            }
            console.log(imagesArray);
        }

        for (let i = 0; i < imagesArray.length; i += 2) {           
            console.log(i,pdf.numPages);
            if (i + 1 <= imagesArray.length && i <= pdf.numPages) {
                
                tmpbk.push({
                    paper: i,
                    f: imagesArray[i],
                    b: imagesArray[i + 1] || ''
                });
            }
        }
        setmax(tmpbk.length)
        setBook1(tmpbk);
        setisloaded(false);
    };

    const fetchbook = async(id:string)=>{
        const fe = await fetch(`${apiurl}/books/${id}`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const res = await fe.json()
        if(fe.ok){
            // console.log(`${apiurl}/${res.file}`);
            
            return `${apiurl}/${res.file}`
        }
        return ''
    }
    let i = ''
    const init = async()=>{
        if (imagesArray.length === 0) {
            renderPdfToImages(await fetchbook(id))
        }
        // i = await fetchbook(id)
        setia(await fetchbook(id))
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


    return (<section className="pagereadbook">

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
                            <div className="front-content">
                                <img src={e.f} alt="" />
                            </div>
                        </div>
                        <div className='back'>
                            <div className="back-content">
                                <img src={e.b} alt="" />
                            </div>
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
        <div className="isloadding">
            
        </div>
        <embed src={ia} type="" />
    </section>);
};