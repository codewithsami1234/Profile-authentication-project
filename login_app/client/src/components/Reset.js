import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import { resetPassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import useFetch from '../hooks/fetch.hook';
import styles from '../styles/Username.module.css';

export default function Reset() {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();

  // ✅ Fixed path: make sure hook hits `/api/createResetSession`
  const [{ isLoading, serverError }] = useFetch('/createResetSession');

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: '',
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (values.password !== values.confirm_pwd) {
        toast.error('Passwords do not match!');
        return;
      }

      try {
        await resetPassword({ username, password: values.password });
        toast.success('Password Reset Successfully!');
        navigate('/password');
      } catch (error) {
        console.error('Reset Error:', error);
        toast.error('Could not Reset!');
      }
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold text-center mt-10">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500 text-center mt-10">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          {/* Title */}
          <div className="title text-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500 block mx-auto">
              Enter your new password
            </span>
          </div>

          {/* Form */}
          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col items-center gap-8 w-80 mx-auto relative">

              {/* Floating Label Input - New Password */}
              <div className="relative w-full">
                <input
                  {...formik.getFieldProps('password')}
                  id="password"
                  type="password"
                  className={`${styles.textbox} peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-3 text-gray-500 transition-all 
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                             peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                             peer-focus:text-blue-500 bg-transparent px-1"
                >
                  New Password
                </label>
              </div>

              {/* Floating Label Input - Confirm Password */}
              <div className="relative w-full">
                <input
                  {...formik.getFieldProps('confirm_pwd')}
                  id="confirm_pwd"
                  type="password"
                  className={`${styles.textbox} peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="confirm_pwd"
                  className="absolute left-3 top-3 text-gray-500 transition-all 
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                             peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                             peer-focus:text-blue-500 bg-transparent px-1"
                >
                  Confirm Password
                </label>
              </div>

              {/* Reset Button */}
              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
