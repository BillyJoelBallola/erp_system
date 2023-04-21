import React from "react";
import { Routes, Route } from 'react-router-dom';

import _404 from './pages/_404';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';

import Employees from "./pages/employee/Employees";
import Employee from "./pages/employee/Employee";
import FormEmployee from "./pages/employee/FormEmployee";

import Customers from './pages/customer/Customers'
import Customer from "./pages/customer/Customer";
import FormCustomer from "./pages/customer/FormCustomer";

import RawMaterials from './pages/rawMaterial/RawMaterials';
import RawMaterial from "./pages/rawMaterial/RawMaterial";
import FormRawMaterial from "./pages/rawMaterial/FormRawMaterial";

import Suppliers from './pages/supplier/Suppliers';
import Supplier from "./pages/supplier/Supplier";
import FormSupplier from './pages/supplier/FormSupplier';

import Products from './pages/product/Products';
import FormProduct from "./pages/product/FormProduct";
import Product from "./pages/product/Product";



const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/*" element={<_404 />}/>
      <Route path="/" element={<Layout />} >
        <Route path="/" element={<Dashboard />}/>  
        <Route path="/customers" element={<Customers />}/>
        <Route path="/customers/form/:id?" element={<FormCustomer />}/>
        <Route path="/customers/:id" element={<Customer />}/>
        <Route path="/suppliers" element={<Suppliers />}/>
        <Route path="/suppliers/form/:id?" element={<FormSupplier />}/>
        <Route path="/suppliers/:id?" element={<Supplier />}/>
        <Route path="/employees" element={<Employees />}/>
        <Route path="/employees/form/:id?" element={<FormEmployee />}/>
        <Route path="/employees/:id?" element={<Employee />}/>
        <Route path="/raw-materials" element={<RawMaterials />}/>
        <Route path="/raw-materials/form/:id?" element={<FormRawMaterial />}/>
        <Route path="/raw-materials/:id?" element={<RawMaterial />}/>
        <Route path="/products/overview/:tab?" element={<Products />}/>
        <Route path="/products/form/:id?" element={<FormProduct />}/>
        <Route path="/products/:id?" element={<Product />}/>
      </Route>
    </Routes>
  );
};

export default App;
