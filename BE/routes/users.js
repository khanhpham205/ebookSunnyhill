var express = require("express");
var router = express.Router();
const dotenv = require('dotenv');
const User = require('../models/M_user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
dotenv.config();
const{ auth, ckAdmin  } = require('../middlewares/auth.js')

// http://localhost:3000/user/signin
router.post("/login",
    async (req, res) => {
        // 400 thong tin nhap vao ko du
        // 404 khong tim thay user
        // 401 sai mk
        // 500 loi khong xac dinh
        // 200 dn tc
        
        const { email, password } = req.body;
        if (!email||!password){return res.status(400).json({ error: 'Missing email or password' });}
        try {   
            const user = await User.findOne({ $or: [{ email: email }, { phonenumber: email }] });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {return res.status(401).json({ error: 'Invalid password' })}
            
            const token = jwt.sign({ userId: user._id, role:user.role }, process.env.JWT_SECRET);
            // , { expiresIn: process.env.JWT_EXPIRES_IN }

            res.status(200).json(token);
        } 
        catch (error) {res.status(500).json({error})}
    }
);

router.post("/signin",
    async (req, res) => {
        const { username, email, password,phonenumber } = req.body;
        
        if (!username || !email || !password || !phonenumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { phonenumber }] });    if (existingUser) {
        return res.status(400).json({ error: 'Email or phoneNumber already exists' });
        }
        try {   
            const newUser = new User({ 
                    username, 
                    email, 
                    password,
                    phonenumber,
                    role:0
            });
            
            newUser.save();
            res.status(200).json({ 
                status: true,
            });
        } catch (error) {
            res.status(500).json({ 
                status: false, 
                error 
            });
        }
    }
);

router.get("/checkadmin", auth, ckAdmin, 
    async(req,res)=>{
        res.status(200).json({
            status:true,
            message:'you have admin role'
        })
    }
)

router.get("/check",auth,
    async(req,res)=>{
        const data = req.user
        const user = await User.findById(req.user.userId)
        data.name = user.username
        res.status(200).json({
            status: true,
            data: req.user
        })
    }
)

router.post("/changepass",auth,
    async(req,res)=>{
        const data = req.user
        const {newpass,oldpass} = req.body
        const salt = await bcrypt.genSalt(10);
        const tmppassword = await bcrypt.hash(oldpass, salt);

        const userdata = await User.findById(data.userId)
        console.log(userdata.password == tmppassword);
        if(userdata.password == tmppassword){
        }else{
            return res.status(401).json({error:'Sai mật khẩu'})
        }

        console.log(data,newpass);
                
        
        res.status(200).json({
            status: true
        })
    }
)



module.exports = router;