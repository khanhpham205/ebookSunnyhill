/* eslint-disable @next/next/no-img-element */
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
    ShowUpdateModel: boolean;
    setShowUpdateModel: (value: boolean) => void;
    book: M_Book | undefined
}
function EditBook(props: isShow) {
    const { ShowUpdateModel, setShowUpdateModel , book } = props;
    const [catalogs, setcatalogs] = useState<M_Catalog[]|null>([]);

    const [img, setimg] = useState<string>("");
    const [name, setname] = useState<string | null>("");
    const [id, setid] = useState<string>();
    
    const fetchcatas = async ()=>{
        const fe = await fetch(`${apiurl}/catalogs`,{
            method: "GET"
        })
        const res = await fe.json()
        if(fe.ok){
            setcatalogs(res)
        }
    }
    useEffect(()=>{
        fetchcatas()   
        if(book){
            setid(book._id)
            setname(book.name)
            setimg(`${apiurl}/${book.img}`)
        }
        
    },[book])

    const handleClose = () => {
        // setid('');
        // setname('');
        // setimg('')
        setShowUpdateModel(false);
    }

    const changeimg = ()=>{
        const imgipt = document.getElementById('form_edit_book_img') as HTMLInputElement
        const img = document.getElementById('form_edit_book_imgpre') as HTMLImageElement
        if(imgipt.files instanceof FileList){
            img.src = URL.createObjectURL(imgipt.files[0])
        }
    }

    const handleSubmit= async()=>{

        const formdt = new FormData(document.getElementById('form_edit_book') as HTMLFormElement)
        const jwt = localStorage.getItem('JWT')
        const fe = await fetch(`${apiurl}/book/edit/${id}`,{
            headers: {
                'authorization': `Bearer ${ jwt }`,
            },
            method: "PUT",
            body: formdt
        })
        const res = await fe.json()
        if(fe.ok){
            toast.success('Sửa book thàng công')
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
                show={ShowUpdateModel}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{color:'var(--secondary)'}}>Edit catalog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form 
                        id='form_edit_book'
                        onSubmit={(e)=>{
                            e.preventDefault()
                            handleSubmit()
                        }} 
                    >
                        <div className="imgpreview">
                            <label htmlFor="form_edit_book_img"
                                title='Khi sửa mục này ảnh bìa sách cũ sẽ bị xóa'
                            >Ảnh bìa</label>
                            <img src={img} alt='' id='form_edit_book_imgpre' />
                        </div>
                        <div className="form_edit_book_input">


                            <label htmlFor="form_edit_book_name">Tên sách</label>
                            <input type="text" id='form_edit_book_name' name="name" 
                                placeholder='Tên sách'
                                value={String(name)}
                                onChange={(e) => setname(e.target.value)}
                            />

                            <label htmlFor="form_edit_book_catalog">Danh mục</label>
                            <select id='form_edit_book_catalog' name='catalog' required>
                                {catalogs?.map((e,i)=>{
                                    if(e._id == book?.catalog._id){
                                        return( <option key={e._id} selected value={e._id}>{e.name}</option>)
                                    }
                                    return( <option key={e._id} value={e._id}>{e.name}</option>)
                                })}
                            </select>
                            <input onChange={changeimg} type="file" 
                                id='form_edit_book_img' hidden 
                                name="img" accept='image/*'
                            />

                            <label htmlFor="form_edit_book_file" 
                                title='Khi sửa mục này file sách cũ sẽ bị xóa'
                            > File sách(PDF)</label>
                            <input type="file" id='form_edit_book_name' name="file" accept='application/pdf'/>

                            <input type="text" hidden name="old_file" value={book?.file} />
                            <input type="text" hidden name="old_img"  value={book?.img} />
                        </div>
                        
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" ><input type="submit" style={{background:'none'}}  value="Edit" form='form_edit_book' /></Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditBook;
