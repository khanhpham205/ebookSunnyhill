var express = require("express")
var multer = require('multer')
const{ auth, ckAdmin } = require('../middlewares/auth.js')

const Book = require('../models/M_book.js')
const Catalog = require('../models/M_catalog.js');

const mongoose1 = require('mongoose');
const fs = require('fs');
const path = require('path');

const uploadFiles = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/books'); 
        },
        filename: function (req, file, cb) {
            const { name } = req.body;
            cb(null, 'Book' + '-' + name + '.' + file.originalname.split('.').at(-1)); 
        }
    })
}).fields([
    { name: 'img', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

async function deleteFile(path) {
    await fs.unlink(path,()=>{});
}

var router = express.Router()

router.get("/",async (req, res) => {
    try {
        const type = req.query.catalog
        // console.log(type);
        if(type){
            const a = await Book.find({catalog:type}).populate('catalog')
            res.status(200).json(a);
        }else{
            const a = await Book.find().populate('catalog')
            res.status(200).json(a);
        }
        
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }
});

router.get("/:id", async(req, res)=>{
    try {
        const a = await Book.findById(req.params.id).populate('catalog')
        res.status(200).json(a);
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }
});

router.post("/add", uploadFiles,
    async(req, res)=>{
        // 401 ko co file | img 
        // 402 ko co book name
        const {name,catalog} = req.body    
        const {file,img} = req.files;

        if(!file || !img ){return res.status(401).json({error:'Không tìm thấy file'})}
        if(!name){return res.status(402).json({error:'Vui lòng nhập tên sách'})}
        
        try {
            const isExist = await Book.findOne({ name })
            const newBook = new Book({
                name,
                img:`books/${img[0].filename}`,
                file:`books/${file[0].filename}`,
                catalog
            })
            if(!isExist){
                newBook.save()
                return res.status(200).json({
                    status:true,
                    message:'them san pham thanh cong',
                })
            }else{
                return res.status(403).json({error:'Tên sách đã tồn tại'})
            }
        }catch (error) {return res.status(500).json({error:'khong the them sach'})}
    }
);

router.put("/edit/:id",uploadFiles,
    async(req, res) => {
        //200 thanh cong
        //400 thong tin nhap vao khong du
        const id = req.params.id;
        const {name,catalog,old_img,old_file} = req.body    
        const {file,img} = req.files;

        console.log(old_file);
        
                
        
        if(!name || !catalog){return res.status(400).json({ error:'Thông tin không đủ'})}
        try {
            let update = {
                name,
                catalog
            };
            if(!!file) {
                update.file = `books/${file[0].filename}`;
            }
            if(!!img){
                update.img = `books/${img[0].filename}`;
            }

            const a = await Book.updateOne( { _id: id }, update )
            return res.status(200).json({ status: true});
        } catch (error) {
            return res.status(500).json({ status: false, message: error });
        }
    }
);

router.delete("/delete/:id", auth, ckAdmin, 
    async (req, res) => {
        const id = req.params.id;
        try {
            const book = await Book.findById(id);
            const imagePath = path.join(__dirname, `../public/${book.img}`);
            const filePath = path.join(__dirname, `../public/${book.file}`);

            console.log(imagePath);
            deleteFile(imagePath)
            deleteFile(filePath)

            await Book.findByIdAndDelete(id)

            return res.status(200).json({status:true,message:'xoa san pham thanh cong'})
        }catch (error) {
            return res.status(500).json({status:false,message:'khong the xoa san pham'})
        }
    }
);

module.exports = router;




