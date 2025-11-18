import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { Toaster, toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';

export default function Profile() {
  const [file, setFile] = useState();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/api/user/${username}`);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const updatedValues = { ...values, profile: file || apiData?.profile || '' };
        await updateUser(updatedValues);
        toast.success('Updated Successfully!');
        console.log('Profile updated data:', updatedValues);
      } catch (error) {
        console.error(error);
        toast.error('Could not update');
      }
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const userLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  // ✅ Fixed profile image logic
  const profileSrc = file || apiData?.profile || avatar;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: '50%' }}>
          <div className="title text-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500 block mx-auto">
              Happy to join you. You can update the details
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={profileSrc}
                  className={`${styles.profile_img} ${extend.profile_img}`}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
                className="hidden"
              />
            </div>

            {/* Input Fields */}
            <div className="flex flex-col gap-6 px-8">
              <div className="flex gap-6">
                <div className="relative w-full">
                  <input
                    {...formik.getFieldProps('firstName')}
                    id="firstName"
                    type="text"
                    className={`${styles.textbox} peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="firstName"
                    className="absolute left-3 top-3 text-gray-500 transition-all 
                      peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                      peer-focus:text-blue-500 bg-transparent px-1"
                  >
                    First Name
                  </label>
                </div>

                <div className="relative w-full">
                  <input
                    {...formik.getFieldProps('lastName')}
                    id="lastName"
                    type="text"
                    className={`${styles.textbox} peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute left-3 top-3 text-gray-500 transition-all 
                      peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                      peer-focus:text-blue-500 bg-transparent px-1"
                  >
                    Last Name
                  </label>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="relative w-full">
                  <input
                    {...formik.getFieldProps('mobile')}
                    id="mobile"
                    type="text"
                    className={`${styles.textbox} peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="mobile"
                    className="absolute left-3 top-3 text-gray-500 transition-all 
                      peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                      peer-focus:text-blue-500 bg-transparent px-1"
                  >
                    Mobile No
                  </label>
                </div>

                <div className="relative w-full">
                  <input
                    {...formik.getFieldProps('email')}
                    id="email"
                    type="email"
                    className={`${styles.textbox} peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-3 text-gray-500 transition-all 
                      peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                      peer-focus:text-blue-500 bg-transparent px-1"
                  >
                    Email
                  </label>
                </div>
              </div>

              <div className="relative w-full">
                <input
                  {...formik.getFieldProps('address')}
                  id="address"
                  type="text"
                  className={`${styles.textbox} peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="address"
                  className="absolute left-3 top-3 text-gray-500 transition-all 
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                    peer-focus:text-blue-500 bg-transparent px-1"
                >
                  Address
                </label>
              </div>

              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{' '}
                <button onClick={userLogout} className="text-red-500">
                  Log out
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
