import { Employee } from "../Models/EmployeeModel.js";

export const addEmployee = async (req, res) => {
    const employeeData = await req.body;
    const {name, dob, age, gender, address, contact, position, salary, deductions, qrCode, code} = await employeeData;
    Employee.create({
        name: name,
        dob: dob,
        age: age,
        gender: gender,
        address: {
            street: address.street,
            barangay: address.barangay,
            city: address.city,
            province: address.province,
            country: address.country
        },
        contact: {
            email: contact.email,
            phoneNumber: contact.phoneNumber
        },
        position: position,
        salary: salary,
        deductions: deductions,
        qrCode: qrCode,
        code: code
    }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err.message);
    })
}

export const updateEmployee = async (req, res) => {
    const employeeData = await req.body;
    const {id, name, dob, age, gender, address, contact, position, salary, deductions, qrCode, code} = await employeeData;
    const employeeInfo = await Employee.findById(id);
    try {
        employeeInfo.set({
            name: name,
            dob: dob,
            age: age,
            gender: gender,
            address: {
                street: address.street,
                barangay: address.barangay,
                city: address.city,
                province: address.province,
                country: address.country
            },
            contact: {
                email: contact.email,
                phoneNumber: contact.phoneNumber
            },
            position: position,
            salary: salary,
            deductions: deductions,
            qrCode: qrCode,
            code: code
        })
        employeeInfo.save();
        res.json(employeeInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllEmployees = async (req, res) => {
    try {
        const response = await Employee.find({}).populate('position');
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Employee.findById(id).populate('position');
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteEmployee = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Employee.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}