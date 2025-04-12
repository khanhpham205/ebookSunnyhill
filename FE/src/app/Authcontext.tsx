/* eslint-disable @typescript-eslint/no-unused-vars */
// context/AuthContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;

type AuthContextType = {
  isLoggedIn: boolean;
  isadmin: boolean;
  login: () => void;
  logout: () => void;
  setadmin:()=> void;
  checkuser:()=>void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isadmin, setisadmin] = useState(false);

    const login = () => {
        setIsLoggedIn(true)
    };
    const setadmin = () => {
        setisadmin(true)
    };
    const logout = () => {
        setIsLoggedIn(false)
        setisadmin(false)
        localStorage.removeItem('JWT')
    };
    const checkuser = async()=>{
        try {
            const jwt = localStorage.getItem('JWT')
            const fe = await fetch(`${apiurl}/users/check`,{
                method:"GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            })
            const res = await fe.json()
            if(fe.ok && res.data.userId){
                // return await res.data;
                setIsLoggedIn(true)
                if(res.data.role){
                    setadmin()
                }
            }
            return {};
        } catch (error) {throw error}
    }
    useEffect(()=>{
        checkuser()
    },[])

    return (
        <AuthContext.Provider value={{ isLoggedIn,isadmin,setadmin, login, logout,checkuser }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
