var express = require('express');
var router = express.Router();

/* GET users listing. */
// const express = require("express");
const User = require("../../models/user");
const bcrypt = require('bcrypt');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

// const router = express.Router();

// 🟢 Create a User
router.post("/create",isAuthenticated,isAdmin,async (req,res,next) => {
  let userdata = req.body
    await models.sequelize.query(`select * from Users where email = "${userdata.email}"`,{
        type: models.sequelize.QueryTypes.SELECT
    })
    .then(async function (user){
        // console.log(user)
        if(user.length > 0){
          res.send({success:true,
            msg:" user already exist "})
        }
        else{
            async function insertuser(hash,salt){
                await models.sequelize.query(`Insert into Users (name,email,hash,role,salt) values("${userdata.username}","${userdata.email}","${hash}"),"BUYER","${salt}"`,{
                    type: models.sequelize.QueryTypes.INSERT
                })
            }
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(hash){
                        insertuser(hash,salt)
                    }
                })
            })
            res.send({success:true,
            msg:"success"})
            
        }
    }).catch((error)=>{
      console.log(error,'router.js 56');
      res.send({
        success:false,
        msg:error,

      })
    })
    
    // res.send("success")
})

// 🔵 Get All Users
router.get("/",isAuthenticated,isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.send({success:true,users:users});
  } catch (error) {
    res.status(500).send({success:false,msg:error.message});
  }
});

// 🟡 Get a Single User by ID
router.get("/:id", isAuthenticated,isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({success:false,msg:"User not found"});
    res.send({success:true,user:user});
  } catch (error) {
    res.status(500).send({success:false,msg:error.message});
  }
});

// 🟠 Update a User
router.put("/:id",isAuthenticated,isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({success:false,msg:"User not found"});

    await user.update({ name, email, password });
    res.send({success:true,user:user});
  } catch (error) {
    res.status(500).send({success:false,msg:error.message});
  }
});

// 🔴 Delete a User
router.delete("/:id",isAuthenticated,isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({success:false,msg:"User not found"});

    await user.destroy();
    res.send({success:true,msg:"User deleted successfully"}) ;
  } catch (error) {
    res.status(500).send({success:false,msg:error.message});
  }
});

module.exports = router;


