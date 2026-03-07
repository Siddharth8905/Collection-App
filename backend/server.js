const express=require("express");
const mongoose=require("mongoose");
const cors = require("cors");
const dotenv=require("dotenv");
const router=require("./Route/AdminRoute");
const customer_router = require("./Route/CustomerRoute");

dotenv.config();

const app= express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("MongoDB error:", err.message));

app.use("/admin", router);
app.use("/customer",customer_router);


const port = 1008;
app.listen(port, () => {
  console.log("Server started at port:", port);
});
