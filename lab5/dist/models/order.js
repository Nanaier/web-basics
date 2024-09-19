import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    Order_ID: { type: String, required: true },
    Employee_ID: { type: String, required: true },
    Order_Amount: { type: Number, required: true },
    Product_Name: { type: String, required: true },
    Client_Company_Name: { type: String, required: true },
    Customer_Surname: { type: String, required: true },
    Created_At: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);
export { Order };
