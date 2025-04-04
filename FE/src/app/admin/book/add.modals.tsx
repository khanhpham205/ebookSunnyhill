/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;


interface isShow {
    ShowModel: boolean;
    setShowModel: (value: boolean) => void;
}
function Addbook(props: isShow) {
    const [catalogs, setcatalogs] = useState<M_Catalog[]|null>([]);

    const { ShowModel, setShowModel } = props;

    const [name, setname] = useState<string>('');
    const [desc, setdesc] = useState<string>();

    useEffect(()=>{
        const fetchposts = async ()=>{
            const fe = await fetch(`${apiurl}/catalogs`,{
                method: "GET"
            })
            const res = await fe.json()
            if(fe.ok){
                setcatalogs(res)
            }
        }
        fetchposts()   
    },[])

    const handleClose = () => {
        setname('');
        // setfile(null);
        // setimg(null)
        // setdesc('');
        setShowModel(false);
    }

    const handleSubmit= async()=>{
        const form = document.getElementById('form_add_book') as HTMLFormElement
        const data = new FormData(form)

        const fe = await fetch(`${apiurl}/book/add`,{
            method:"POST",
            body: data
        })
        const res = await fe.json()
        
        if(fe.ok){
            toast.success('Thêm sách thành công')
            handleClose()
        }else{
            toast.warning(res.error)
        }
    }

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal
                show={ShowModel}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{color:'var(--secondary)'}}>Create catalog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='form_add_book' onSubmit={(e)=>{
                        e.preventDefault()
                        handleSubmit()
                    }}>
                        <label htmlFor="">Book name</label>
                        <input id='ad_add_book_name' type="text" name='name' placeholder='Name' required />
                        
                        <label htmlFor="">Book img</label>
                        <input id='ad_add_book_img' type="file" name='img'  accept='image/*' required />

                        <label htmlFor="">Book file (PDF)</label>
                        <input id='ad_add_book_file' type="file" name='file' accept='application/pdf'  required />

                        <label htmlFor="">Catalog</label>
                        <select id='ad_add_book_catalog' name='catalog' required>
                            {catalogs?.map((e,i)=>{
                                const sl = ''
                                if(i==0){
                                    return( <option key={e._id} selected value={e._id}>{e.name}</option>)
                                }
                                return( <option key={e._id} value={e._id}>{e.name}</option>)
                            })}
                        </select>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button><input type="submit" style={{background:'none'}}  value="Add" form='form_add_book' /></Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
}
export default Addbook;