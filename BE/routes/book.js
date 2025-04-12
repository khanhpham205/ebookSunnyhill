var express = require("express")
var multer = require('multer')
const{ auth, ckAdmin } = require('../middlewares/auth.js')

const Book = require('../models/M_book.js')
const User = require('../models/M_user.js')
const mongoose = require('mongoose');

const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

var router = express.Router()

const uploadFiles = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/booksf'); 
        },
        filename: function (req, file, cb) {
            const newId = new mongoose.Types.ObjectId();
            req.body._id = newId.toString();
            req.id = newId.toString(); 
            let id = newId.toString()
            console.log(req);
            if(req.params.id){
                id=req.params.id
            }

            cb(null, `Book-${id}.` + file.originalname.split('.').at(-1)); 
        }
    })
}).fields([
    { name: 'img', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

async function deleteFile(path) {
    if(fs.existsSync(path)){
        await fs.unlink(path,()=>{});
    }
}

async function parceToJsonGPT(pdfPath, jsonPath, id) {
    
    const outputDir = path.join(__dirname, '../public/imgtmp');
    const outputPrefix = path.join(outputDir, id);
    
    const cmd = `pdftoppm -jpeg -r 80 "${pdfPath}" "${outputPrefix}"`;
    
    exec(cmd, (error, stdout, stderr) => {
        if(error){
            return new Error('can not parce pdf')
        }

        const images = fs.readdirSync(outputDir)
        const data = {  
            pages: images.map(img => {
                const imgPath = path.join(outputDir, img);
                const base64 = fs.readFileSync(imgPath, { encoding: "base64" });
                return `data:image/jpeg;base64,${base64}`;
            })
        };

        fs.writeFileSync(jsonPath, JSON.stringify(data));
        images.forEach(e=>{
            deleteFile(path.join(outputDir, e))
        })
    });
}

function removeVietnameseTones(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
}


router.get("/bookjson/:id",async (req, res) => {
    try {       
        const bookdata = await Book.findById(req.params.id)

        const jsonPath = path.join(__dirname, '../public/book-json', `${bookdata._id.toString()}.json`);
        const PDFPath = path.join(__dirname, '../public/', bookdata.file);

        if(!fs.existsSync(jsonPath)){
            await parceToJsonGPT(PDFPath ,  jsonPath,bookdata._id.toString())
        }
        const jsondt = require(jsonPath)
        return res.status(200).json( jsondt)
    } catch (error) {return res.status(500).json({ status: false, message: error });}
});

router.get("/",async (req, res) => {
    try {
        const type = req.query.catalog
        console.log(type);
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

router.get("/search",async (req, res) => {
    try {
        const q = req.query.searchname
        const mode = req.query.mode
        // const keywords = removeVietnameseTones(q).split(/\s+/);
        // const keyword = removeVietnameseTones(q);
        // const conditions = keywords.map(word => ({
        //     name_unsigned: { $regex: word, $options: 'i' },
        // }));
        const keyword = removeVietnameseTones(q.trim().toLowerCase());
        const parts = keyword.split(/\s+/);
        const orderedRegex = parts.join('.*?');

        if(!mode){
            // console.log(123);
            // const a = await Book.find({ $and: conditions }).limit(5);
            const a = await Book.find({
                name_unsigned: { $regex: orderedRegex, $options: 'i' },
            }).populate('catalog').limit(5);
            res.status(200).json(a);
        }else{
            const a = await Book.find({
                name_unsigned: { $regex: keyword, $options: 'i' },
            });
            res.status(200).json(a);
        }
    } catch (error) {res.status(500).json({ status: false, message: error })}
});

router.get("/generalinfo",async (req, res) => {
    try {
        const bookdata = await Book.find()
        const userdata = await User.find()
        res.status(200).json([
            {
                name:"Kho sách",
                data:bookdata.length
            },
            {
                name:"Số lượt xem",
                data:1023
            },
            {
                name:"Thành viên",
                data:userdata.length
            }
        ]);

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

        const {name,catalog,_id} = req.body    
        const {file,img} = req.files;

        if(!file || !img ){return res.status(401).json({error:'Không tìm thấy file'})}
        if(!name){return res.status(402).json({error:'Vui lòng nhập tên sách'})}
        

        try {
            const isExist = await Book.findOne({ name })
            const newBook = new Book({
                _id,
                name,
                img:`booksf/${img[0].filename}`,
                file:`booksf/${file[0].filename}`,
                catalog
            })
            if(!isExist){
                newBook.save()
                return res.status(200).json({
                    status:true,
                    message:'them san pham thanh cong'
                })
            }else{
                const tmpimgpath = path.join(__dirname, `../public/${newBook.img}`)
                const tmppdfpath = path.join(__dirname, `../public/${newBook.file}`)
                deleteFile(tmpimgpath)
                deleteFile(tmppdfpath)
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
        const {name,catalog,} = req.body    
        const file = req.files.file;
        const img = req.files.img;     
        
        if(!name || !catalog){return res.status(400).json({ error:'Thông tin không đủ'})}
        try {
            let update = {
                name,
                catalog
            };
            if(!!file) {
                update.file = `booksf/${file[0].filename}`;
            }
            if(!!img){
                update.img = `booksf/${img[0].filename}`;
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
            const jsonPath = path.join(__dirname, `../public/book-json/${book._id}.json`);

            console.log(imagePath);
            
            deleteFile(imagePath)
            deleteFile(filePath)
            // if
            deleteFile(jsonPath)

            await Book.findByIdAndDelete(id)

            return res.status(200).json({status:true,message:'xoa san pham thanh cong'})
        }catch (error) {
            return res.status(500).json({status:false,message:'khong the xoa san pham'})
        }
    }
);

module.exports = router;




