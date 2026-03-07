const express=require("express")
const router=express.Router();
const Cust=require("../Controller/CustomerController")

router.post("/registercustomer",Cust.register_customer)//http://localhost:1008/customer/registercustomer
router.get("/getcustomer",Cust.get_customer)//http://localhost:1008/customer/getcustomer
router.get("/getcustomer/:id",Cust.get_single_customer)//http://localhost:1008/customer/getcustomer/${id}
router.put("/updatebalance/:id", Cust.update_balance);//http://localhost:1008/customer/updatebalance/${id}
router.delete("/deleteCustomer/:id",Cust.delete_customer)//http://localhost:1008/customer/deleteCustomer/${id}
module.exports=router