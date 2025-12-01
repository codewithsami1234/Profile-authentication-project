import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { toast, Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import styles from '../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = { ...values, profile: file || '' };
      try {
        // Update: call your Vercel serverless function
        const registerPromise = registerUser(values);

        toast.promise(registerPromise, {
          loading: 'Creating account...',
          success: <b>Registered Successfully!</b>,
          error: <b>Could not register.</b>,
        });

        await registerPromise;
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Unable to register. Please try again.');
      }
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center min-h-screen">
        <div className={`${styles.glass} w-full max-w-md`}>
          <div className="title text-center">
            <h4 className="text-4xl font-bold mb-2">Register</h4>
            <span className="py-2 text-lg text-gray-600 block">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex flex-col w-80 gap-6 mx-auto">
              <div className="relative">
                <input
                  {...formik.getFieldProps('email')}
                  id="email"
                  type="email"
                  className={`${styles.textbox} peer`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  {...formik.getFieldProps('username')}
                  id="username"
                  type="text"
                  className={`${styles.textbox} peer`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  Username
                </label>
              </div>

              <div className="relative">
                <input
                  {...formik.getFieldProps('password')}
                  id="password"
                  type="password"
                  className={`${styles.textbox} peer`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  Password
                </label>
              </div>

              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-600">
                Already Registered?{' '}
                <Link className="text-red-500 font-medium" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
