const mongoose = require("mongoose");
const employeeConfig = require("../config/database");

// Create a SEPARATE connection for Employee DB
const employeeConn = mongoose.createConnection(employeeConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Employee Schema
const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    salary: { type: Number, required: true },
    age: { type: Number, required: true }
  },
  { timestamps: true }
);

// Register the Employee model
const Employee = employeeConn.model("Employee", EmployeeSchema, "employees");

// Export model
module.exports = Employee;
