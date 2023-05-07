import { Customer } from "../Models/CustomerModel.js";

export const addCustomer = async (req, res) => {
    const customerData = await req.body;
    const { name, business, address, contact } = await customerData;
    Customer.create({
        name: name,
        business: business,
        address: {
            street: address.street,
            barangay: address.barangay,
            city: address.city,
            province: address.province,
            country: address.country,
        },
        contact:{
            email: contact.email,
            phoneNumber: contact.phoneNumber,
        },
    }).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err.message)
    })
}

export const updateCustomer = async (req, res) => {
    const customerData = await req.body;
    const { _id, name, business, address, contact } = await customerData;
    const customerInfo = await Customer.findById(_id);
    try {
        customerInfo.set({
            name: name,
            business: business,
            address: {
                street: address.street,
                barangay: address.barangay,
                city: address.city,
                province: address.province,
                country: address.country,
            },
            contact:{
                email: contact.email,
                phoneNumber: contact.phoneNumber,
            },
        })
        customerInfo.save();
        res.json(customerInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        const response = await Customer.find({});
        res.json(response); 
    } catch (error) {
        res.json(error.message)
    }
}

export const getCustomerById = async (req, res) => {
    const { id } = await req.params;
    try {
        res.json(await Customer.findById(id));
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteCustomer = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Customer.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}