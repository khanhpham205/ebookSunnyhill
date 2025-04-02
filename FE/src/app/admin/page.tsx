/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";

import Bookpage from './book/page';
import Catalogpage from './catalog/page';


function Admin() {
    const [activeTab, setActiveTab] = useState<string>('books');

    const handleTabClick = (tabName:string) => {
        setActiveTab(tabName);
    };

    return (
        <section className='gridsys adminpage' >
            <div id='admin_handle' >
                <button 
                    className='active'
                    onClick={(e) => {
                        [...document.getElementById('admin_handle')!.children].forEach(e=>{
                            e.classList.remove('active')
                        })
                        const bt = e.target as HTMLElement
                        bt.classList.add('active')
                        handleTabClick('books')
                    }}
                >Books</button>
                <button 
                    onClick={(e) => {
                        [...document.getElementById('admin_handle')!.children].forEach(e=>{
                            e.classList.remove('active')
                        })
                        const bt = e.target as HTMLElement
                        bt.classList.add('active')
                        handleTabClick('catalogs')
                    }}
                >catalogs</button>

            </div>

            <div id='admin_page'>
                {activeTab === 'books' && <Bookpage/>}
                {activeTab === 'catalogs' && <Catalogpage/>}
            </div>
        </section>
    );
}
export default Admin;


