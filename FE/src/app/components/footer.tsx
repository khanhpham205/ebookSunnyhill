/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";

import { Button } from "react-bootstrap";
const Footer = () => {

    return (
        <footer className="gridsys mt-4" id="footer">
            <img src="/images/logo.png" alt="logo"/>
            <p id='info' >SunnyHill eBook: Trang web đọc sách điện tử miễn phí dành cho các tín đồ ham mê đọc sách trên mọi miền tổ quốc.</p>
            <p id="holder"></p>
            <a href="">Góp ý</a>
            <a href="">Liên hệ</a>
            <a href="">Facebook</a>
            <a href="">Instagram</a>
            <a href="">Instagram</a>
            <a href="">Instagram</a>
            <p className="copyright fullcol">
                ©Copyright 2025 By Sunnyhill Team
            </p>
        </footer>
    );
};

export default Footer




