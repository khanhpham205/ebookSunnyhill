/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { title } from 'process';
import { mutate } from 'swr'

import dotenv from 'dotenv';
dotenv.config()
const apiurl = process.env.NEXT_PUBLIC_API_URL;
interface isShow {
    ShowUpdateModel: boolean;
    setShowUpdateModel: (value: boolean) => void;
    cata: M_Catalog | undefined
}
function EditCata(props: isShow) {
    const { ShowUpdateModel, setShowUpdateModel , cata } = props;

    const [name, setname] = useState<string>("");
    const [desc, setdesc] = useState<string>('');
    const [id, setid] = useState<string>();

    useEffect(()=>{
        if(cata){
            setid(cata._id)
            setname(cata.name)
            setdesc(cata.desc)
        }
    },[cata])

    const handleClose = () => {
        setname("");
        setid('');
        setdesc('');
        setShowUpdateModel(false);
    }

    const handleSubmit= async()=>{
        const jwt = localStorage.getItem('JWT')
        const fe = await fetch(`${apiurl}/catalogs/edit/${id}`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${ jwt }`,
            },
            method: "PUT",
            body: JSON.stringify({
                name,
                desc
            })
        })
        const res = await fe.json()
        if(fe.ok){
            toast.success('sua post thanh cong')
            handleClose()
            mutate(`${apiurl}/catalogs`)
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
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit catalog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3" >
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Title" value={name}
                                onChange={(e) => setname(e.target.value)} />
                        </Form.Group>   
                        <Form.Group className="mb-3" >
                            <Form.Label>Views</Form.Label>
                            <Form.Control type="text" placeholder="Desc" value={desc}
                                onChange={(e) => setdesc(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>Update</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditCata;
