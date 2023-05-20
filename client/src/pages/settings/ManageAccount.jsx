import React, { useContext, useEffect, useState } from "react";
import userImageProxy from "../../assets/user.webp";
import { UserContext } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import AccountModal from "../../components/AccountModal";
import axios from "axios";

const ManageAccount = () => {
  const { currentUser, setUpdate } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("");
  const [account, setAccount] = useState({
    userImage: "",
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [editInfo, setEditInfo] = useState(false);

  useEffect(() => {
    if(currentUser){ 
      const { userImage, firstName, lastName, email, _id} = currentUser;
      setAccount((prev) => ({
        ...prev,
        userImage,
        firstName,
        lastName,
        email,
        _id
      }))
    };
  }, [currentUser])

  const inputForm = (e) => {
    setAccount((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const [uploadedImage, setUploadedImage] = useState("");
  
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if(file !== undefined){
      formData.append("image", file);
      const {data: filename} = await axios.post("/upload_image", formData, {
        headers: { "Content-type": "multipart/form-data" },
      });
      setUploadedImage(filename)
    }
  }

  useEffect(() => {
    if(uploadedImage){
      axios.put("/update_img_profile", { uploadedImage }).then(({ data }) => {
        setAccount((prev) => ({
          ...prev,
          userImage: data.userImage
        }))
        setUpdate("update");
      })
    }
  }, [uploadedImage])

  const handleEditInfo = async () => {
    if(account.firstName === "" || 
      account.lastName === "" || 
      account.email === "" 
    ){
      return toast.warning("Fill up all fields.", { position: toast.POSITION.TOP_RIGHT })
    }
    const { firstName, lastName, email } = account;
    const { data } = await axios.put("/update_info_profile", {firstName, lastName, email});
    if(typeof data === "object"){
      setUpdate("info");
      setAccount((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        email: "",
      }))
      return toast.success("Successfully edited.", { position: toast.POSITION.TOP_RIGHT });
    }else{
      return toast.success("Failed to edit info.", { position: toast.POSITION.TOP_RIGHT });
    }
  }

  const handleEditPassword = async () => {
    if(account.newPassword === ""){
      return toast.warning("Fill up all fields.", { position: toast.POSITION.TOP_RIGHT })
    }

    if(account.newPassword !== account.confirmPassword){
      return toast.error("Password did not match.", { position: toast.POSITION.TOP_RIGHT })
    }
    const { newPassword } = account;
    const { data } = await axios.put("/update_password_profile", {newPassword});
    if(typeof data === "object"){
      setUpdate("password");
      setAccount((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: ""
      }))
      return toast.success("Successfully edited.", { position: toast.POSITION.TOP_RIGHT });
    }else{
      return toast.success("Failed to edit password.", { position: toast.POSITION.TOP_RIGHT });
    }
  }

  return (
    <>
      <ToastContainer 
        draggable={false}
        hideProgressBar={true}
      />
      <AccountModal 
        visible={visible}
        setVisible={setVisible}
        action={action}
        setAction={setAction}
        account={account}
        handleEditInfo={handleEditInfo}
        handleEditPassword={handleEditPassword}
        setEditInfo={setEditInfo}
      />
      <div className="pt-4 pb-10 px-20 text-dark max-md:px-4">
        <h2 className="font-bold text-2xl py-4 uppercase border-b-gray-200 border-b">my account</h2>
        <div className="mt-10">
          <div className="grid grid-cols-[200px_1fr] gap-10 max-md:grid-cols-1">
            <div className="flex flex-col gap-5">
              <label htmlFor="userImage" className="flex items-center justify-center w-32 border-gray-300 border-2 aspect-square overflow-hidden rounded-full cursor-pointer">
                <img src={account.userImage ? `http://localhost:4000/uploads${account.userImage}` : userImageProxy} className="object-contain" alt="user-image" />
              </label>
              <input accept="image/*" type="file" id="userImage" className="hidden" onChange={uploadImage}/>
              <div className="grid">
                <span className="text-lg font-semibold">{`${currentUser?.firstName} ${currentUser?.lastName}`} </span>
                <span className="text-sm">{currentUser?.email}</span>
                <span>{currentUser?.role}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">ACCOUNT INFORMATION</h3>
              <p className="text-sm text-gray-400">Manage your account information.</p>
              <div className="mt-5 grid gap-6">
                <div className="grid gap-4 rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">INFO</span>
                      {
                        editInfo ?
                        <div className="flex gap-2 border rounded-lg py-1 px-2">
                          <div 
                            className="cursor-pointer hover:text-blue-400"
                            onClick={() => {
                              setAction("editInfo");
                              setVisible(true);
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <div className="cursor-pointer hover:text-red-400" onClick={() => setEditInfo(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        </div>
                        :
                        <div 
                          className="flex gap-2 text-sm border rounded-lg py-1 px-2 cursor-pointer hover:bg-[#f1f1f1] duration-150" onClick={() => setEditInfo(true)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          <span>Edit</span>
                        </div>
                      }
                  </div>
                  <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1 max-md:gap-6">
                    <div className="form-group">
                      <label htmlFor="" className="text-xs text-light">FIRST NAME</label>
                      {
                        editInfo ? 
                        <input type="text" placeholder="First Name" name="firstName" value={account.firstName} onChange={inputForm}/>
                        :
                        <span className="">{account.firstName}</span>
                      }
                    </div>
                    <div className="form-group">
                      <label htmlFor="" className="text-xs text-light">LAST NAME</label>
                      {
                        editInfo ? 
                        <input type="text" placeholder="Last Name" name="lastName" value={account.lastName} onChange={inputForm}/>
                        :
                        <span className="">{account.lastName}</span>
                      }
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="text-xs text-light">EMAIL</label>
                    {
                      editInfo ? 
                      <input type="email" placeholder="Email address" name="email" value={account.email} onChange={inputForm}/>
                      :
                      <span className="">{account.email}</span>
                    }
                  </div>
                </div>
                <div className="grid gap-4 rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">PASSWORD</span>
                    <div 
                      className="text-sm border rounded-lg py-1 px-2 cursor-pointer hover:bg-[#f1f1f1] duration-150"
                      onClick={() => {
                        setAction("editPassword");
                        setVisible(true);
                      }}>
                      Save
                    </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAccount;
