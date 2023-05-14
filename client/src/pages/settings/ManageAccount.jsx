import React, { useContext, useEffect, useState } from "react";
import userImageProxy from "../../assets/user.webp";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const ManageAccount = () => {
  const { currentUser } = useContext(UserContext);
  const [imageLink, setImageLink] = useState("");
  const [account, setAccount] = useState({
    userImage: "",
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if(currentUser){ 
      const { userImage, firstName, lastName, email } = currentUser;
      setAccount((prev) => ({
        ...prev,
        userImage,
        firstName,
        lastName,
        email
      }))
    };
  }, [currentUser])

  const inputForm = (e) => {
    setAccount((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const {data: filename} = await axios.post("/upload_image", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
    setAccount((prev) => ({
      ...prev,
      userImage: filename
    }))
  }

  // useEffect(() => {
  //   if(account.userImage){
  //     axios.get(`/file${account.userImage}`).then(({data}) => {
  //       setImageLink(data);
  //     })
  //   }
  // }, [account.userImage])

  const submitManageAccount = (e) => {
    e.preventDefault();
    console.log(account);
  } 
  
  return (
    <div className="py-4 px-20 text-dark max-md:px-4">
      <h2 className="font-bold text-2xl py-4 uppercase border-b-gray-200 border-b">my account</h2>
      <div className="mt-10">
        <form className="grid grid-cols-[200px_1fr] gap-10 max-md:grid-cols-1" >
          <div className="flex flex-col gap-5">
            <label htmlFor="userImage" className="w-32 border-gray-300 border-2 aspect-square overflow-hidden rounded-full cursor-pointer">
              <img src={userImageProxy} className="object-contain" alt="user-image" />
            </label>
            <input type="file" id="userImage" className="hidden" onChange={uploadImage}/>
            <div className="grid">
              <span className="text-lg font-semibold">Billy Joel Ballola</span>
              <span className="text-sm">billyjoe123@gmail.com</span>
              <span>Admin</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">ACCOUNT INFORMATION</h3>
            <p className="text-sm text-gray-400">Manage your account information.</p>
            <div className="mt-5 grid gap-6">
              <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1 max-md:gap-6">
                <div className="form-group">
                  <label htmlFor="" className="text-xs text-light">FIRST NAME</label>
                  <input type="text" placeholder="First Name" name="firstName" value={account.firstName} onChange={inputForm}/>
                </div>
                <div className="form-group">
                  <label htmlFor="" className="text-xs text-light">LAST NAME</label>
                  <input type="text" placeholder="Last Name" name="lastName" value={account.lastName} onChange={inputForm}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="" className="text-xs text-light">EMAIL</label>
                <input type="email" placeholder="Email address" name="email" value={account.email} onChange={inputForm}/>
              </div>
              <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1 max-md:gap-6">
                <div className="form-group">
                  <label htmlFor="" className="text-xs text-light">NEW PASSWORD</label>
                  <input type="password" placeholder="Password" name="newPassword" value={account.newPassword} onChange={inputForm}/>
                </div>
                <div className="form-group">
                  <label htmlFor="" className="text-xs text-light">CONFIRM PASSWORD</label>
                  <input type="password" placeholder="Confirm Password" name="confirmPassword" value={account.confirmPassword} onChange={inputForm}/>
                </div>
              </div>
              <button onClick={submitManageAccount} className="btn-dark mt-4">SAVE</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;
