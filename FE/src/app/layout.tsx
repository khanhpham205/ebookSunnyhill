/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { GoogleAnalytics } from '@next/third-parties/google';

import "./globals.css";

import Header from "./components/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export const metadata = {
    title: 'SunnyHill Ebook',
    description: 'Đọc sách miễn phí cùng SunnyHill',
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <GoogleAnalytics gaId="G-V1VB0TTV5V" />
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Header />
                {children}

                <ToastContainer autoClose={5000} position="bottom-right" />
            </body>
        </html>
    );
}
