const express=require("express")
const router=express.Router();
const AdminController=require("../Controller/AdminController")

router.post("/savedata",AdminController.register_admin)//http://localhost:1008/admin/savedata
router.post("/adminlogin",AdminController.admin_login)//http://localhost:1008/admin/adminlogin

module.exports=router