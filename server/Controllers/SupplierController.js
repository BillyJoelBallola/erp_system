import { RawMaterials } from '../Models/RawMaterialModel.js';
import { Supplier } from '../Models/SupplierModel.js';

export const addSupplier = async (req, res) => {
    const supplierData = await req.body;
    const { name, business, address, contact } = await supplierData;
    Supplier.create({
        name: name,
        business: business,
        address: {
            street: address.street,
            barangay: address.barangay,
            city: address.city,
            province: address.province,
            country: address.country,
        },
        contact: {
            email: contact.email,
            phoneNumber: contact.phoneNumber,
        }
    }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err.message);
    })
};

export const updateSupplier = async (req, res) => {
    const supplierData = await req.body;
    const { _id, name, business, address, contact } = await supplierData;
    const supplierInfo = await Supplier.findById(_id);
    try {
        supplierInfo.set({
            name: name,
            business: business,
            address: {
                street: address.street,
                barangay: address.barangay,
                city: address.city,
                province: address.province,
                country: address.country,
            },
            contact: {
                email: contact.email,
                phoneNumber: contact.phoneNumber,
            }
        })
        supplierInfo.save();
        res.json(supplierInfo);
    } catch (error) {
        res.json(error.message);
    }
};

export const getAllSupplier = async (req, res) => {
    try {
        const response = await Supplier.find({});
        res.json(response);
    } catch (error) {
        res.json(error.message); 
    }
};

export const getSupplierById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Supplier.findById(id);
        res.json(response);
    } catch (error) {
        res.json(error.message); 
    }
  
};

export const deleteSupplier = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Supplier.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
};