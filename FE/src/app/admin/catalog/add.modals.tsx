/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr'


const apiurl = process.env.NEXT_PUBLIC_API_URL;

interface isShow {
    ShowModel: boolean;
    setShowModel: (value: boolean) => void;
}
function AddCata(props: isShow) {
    const { ShowModel, setShowModel } = props;

    const [name, setname] = useState<string>('');
    const [desc, setdesc] = useState<string>('');

    const handleClose = () => {
        setname('');
        setdesc('');
        setShowModel(false);
    }

    const handleSubmit= async()=>{
        const jwt = localStorage.getItem('JWT');
        const data ={
            name,
            desc
        }
        //goi api add catalog
        const fe = await fetch(`${apiurl}/catalogs/add`,{
            method:"POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify(data)
        })
        const res = await fe.json()
        if(fe.ok){
            toast.success('Thêm danh mục thành công')
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
                show={ShowModel}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{color:'var(--secondary)'}}>Create catalog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group  className="mb-3">
                            <Form.Label  style={{color:'var(--secondary)'}}>Title</Form.Label>
                            <Form.Control type="text" placeholder="Title" value={name}
                                onChange={(e) => setname(e.target.value)} />
                        </Form.Group>   
                        <Form.Group className="mb-3">
                            <Form.Label style={{color:'var(--secondary)'}}>Description</Form.Label>
                            <Form.Control type="text" placeholder="Description" value={desc}
                                onChange={(e) => setdesc(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>Add</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default AddCata;
