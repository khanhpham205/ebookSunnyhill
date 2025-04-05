var express = require("express");
var router = express.Router();
const { auth, ckAdmin } = require('../middlewares/auth.js')

const Catalog = require('../models/M_catalog.js');
const Book = require('../models/M_book.js')

router.get("/", async function (req, res) {
    try {
        const catas = await Catalog.find()
        const catalogs = await Catalog.aggregate([
            {
                $lookup: {
                    from: "books",
                    let: { catalogId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$catalog", "$$catalogId"] }
                            }
                        }
                    ],
                    as: "books"
                }
            },
            {
                $project: {
                    name: 1,
                    desc: 1,
                    countbook: { $size: "$books" }
                }
            }
        ]);

        console.log(catalogs);
          
        res.status(200).json(catalogs);
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }
});

router.get("/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const cata = await Catalog.findById(id)
        res.status(200).json(cata);
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }
});

router.post("/add",auth, ckAdmin,
    async (req, res)=>{
        // 400 thong tin khong du
        // 401 ten danh muc da ton tai
        // 200 thanh cong
        // 500 loi code|sever
        try {
            const {name,desc} = req.body
        
            if(!name || !desc ){
                return res.status(400).json({
                    error:'vui lòng nhập đủ thông tin'
                })
            }
            const isExist = await Catalog.findOne({ name })
            if(isExist){
                return res.status(401).json({
                    error:'Danh mục đã tồn tại'
                })
            }

            const newcata = new Catalog({
                name,
                desc,
            })
            const add = await newcata.save()

            res.status(200).json({ 
                status: true, 
                message:'them danh muc thanh cong',
                data:add
            });
        } catch (error) {
            res.status(500).json({ status: false, message: error });
        }
    }
);

router.put("/edit/:id", auth, ckAdmin, 
    async(req, res)=>{
        const id = req.params.id
        const {name,desc}=req.body
        if(!id){
            return res.status(404).json({error:'khong tin thay danh muc'})
        }
        if(!name || !desc){
            return res.status(401).json({error:'vui long nhap du thong tin'})
        }
        try {
            const editedcata= {
                name,
                desc
            }
            console.log(editedcata);
            
            const data=await Catalog.updateOne( { _id: id }, editedcata )
            res.status(200).json({ 
                status: true,
                message:'thay doi thong tin thanh cong', 
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
);

router.delete("/delete/:id", auth, ckAdmin,
    async(req, res)=>{
        const id = req.params.id
        console.log(id);
        
        try {
            const pros = await Book.find({
                'catalog':id
            })
            if(pros.length>0){
                return  res.status(400).json({ error:'Không thể xóa danh mục '});
            }
            await Catalog.findByIdAndDelete(id);
            res.status(200).json({ status: true, message:'Xoa danh muc thanh cong'});
        } catch (error) {
            res.status(500).json({ 
                error 
            });
        }
    }
);
module.exports = router;
