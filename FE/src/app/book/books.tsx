/* eslint-disable @next/next/no-img-element */


'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from "react";
import Head from 'next/head';

const apiurl = process.env.NEXT_PUBLIC_API_URL;

const Book = () => {
  const [books, setBooks] = useState<M_Book[]>([]);
  const searchParams = useSearchParams();
  const catalog = searchParams.get("catalog");

  useEffect(() => {
    const getBooks = async () => {
      const query = catalog ? `?catalog=${catalog}` : '';
      const res = await fetch(`${apiurl}/books${query}`);
      const data = await res.json();
      if (res.ok) {
        setBooks(data);
      }
    };

    getBooks();
  }, [catalog]);

  const handleSort = (type: string) => {
    const sorted = [...books];
    if (type === "A-Z") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (type === "Z-A") sorted.sort((a, b) => b.name.localeCompare(a.name));
    setBooks(sorted);
  };

  return (<>
    <Head><title>SunnyHill Admin</title></Head>
    <section className="bookspage gridsys">
      <h2 style={{ gridColumn: '1/4' }}>Book page</h2>
      <select id='sorttag' onChange={(e) => handleSort(e.target.value)}>
        <option disabled selected>Sort by:</option>
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
      </select>
      <hr style={{ margin: 0 }} />
      {books?.map((e) => (
        <Link key={e._id} className="book_card" href={`book/${e._id}`}>
          <img src={`${apiurl}/${e.img}`} alt="" />
          <h5>{e.name}</h5>
          <p>{e.catalog.name}</p>
        </Link>
      ))}
    </section>
    </>);
};

export default Book;
