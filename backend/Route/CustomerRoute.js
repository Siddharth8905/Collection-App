const express=require("express")
const router=express.Router();
const Cust=require("../Controller/CustomerController")

router.post("/registercustomer",Cust.register_customer)//http://localhost:1008/customer/registercustomer
// ✅ GET ALL (WITH finance name)
router.get("/getcustomers/:financename", Cust.get_customer)//http://localhost:1008/customer/getcustomers/${financename}

// ✅ GET SINGLE
router.get("/getcustomer/:financename/:id", Cust.get_single_customer)//http://localhost:1008/customer/getcustomer/${financename}/${id}

// ✅ UPDATE
router.put("/updatebalance/:financename/:id", Cust.update_balance)//http://localhost:1008/customer/updatebalance/${financename}/${id}

// ✅ DELETE
router.delete("/deleteCustomer/:financename/:id", Cust.delete_customer)//http://localhost:1008/customer/deleteCustomer/${financename}/${id}

//Renew Customer
router.put("/updatecustomer/:financename/:id", Cust.update_Customer)//http://localhost:1008/customer/updatecustomer/${financename}/${id}
//transaction history
router.get("/transactions/:financename/:customerid",Cust.get_transactions)//http://localhost:1008/customer/transactions/${financename}/${customerid}
//add_favorite
router.put("/favorite/:financename/:id",Cust.add_favorite)//http://localhost:1008/customer/favorite/${financename}/${id}
//get_favorite
router.get("/favorites/:financename",Cust.get_favorites)//http://localhost:1008/customer/favorites/${financename}
//today collection
router.get("/todaycollection/:financename",Cust.get_today_collection)
//history
router.get("/history/:financename", Cust.get_all_completed_dues)
module.exports=router