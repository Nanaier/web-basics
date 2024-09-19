import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
    Employee_ID: { type: String, required: true },
    First_Name: { type: String, required: true },
    Last_Name: { type: String, required: true },
    Age: { type: Number },
    Hire_Date: { type: Date },
    Department: { type: String },
    Created_At: { type: Date, default: Date.now },
});
const Employee = mongoose.model("Employee", employeeSchema);
export { Employee };
