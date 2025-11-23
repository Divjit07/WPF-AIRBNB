const Employee = require("../models/employee");

// ------------------------
// GET ALL (Q1 – SIMPLE)
// ------------------------
exports.getAll = async (req, res, next) => {
  try {
    const employees = await Employee.find().lean();
    return res.status(200).json(employees);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    next(err);
  }
};

// ------------------------
// GET ONE
// ------------------------
exports.getOne = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id).lean();
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    return res.status(200).json(emp);
  } catch (err) {
    console.error("GET ONE ERROR:", err);
    next(err);
  }
};

// ------------------------
// CREATE (POST)
// ------------------------
exports.create = async (req, res, next) => {
  try {
    const employee = await Employee.create({
      name: req.body.name,
      salary: req.body.salary,
      age: req.body.age,
    });

    return res.status(201).json(employee);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    next(err);
  }
};

// ------------------------
// UPDATE (PUT)
// ------------------------
exports.update = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age,
      },
      { new: true }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    return res.json(employee);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    next(err);
  }
};

// ------------------------
// DELETE
// ------------------------
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Not found" });

    return res.status(204).send();
  } catch (err) {
    console.error("DELETE ERROR:", err);
    next(err);
  }
};
