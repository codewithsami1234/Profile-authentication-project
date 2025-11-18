import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { Toaster, toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';
import { authenticate } from '../helper/helper';
import styles from '../styles/Username.module.css';

export default function Username() {
  const navigate = useNavigate();
  const usernameStore = useAuthStore((state) => state.auth.username);
  const setUsername = useAuthStore((state) => state.setUsername);

  useEffect(() => {
    console.log('Current username in store:', usernameStore);
  }, [usernameStore]);

  const formik = useFormik({
    initialValues: { username: usernameStore || '' },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const errors = await usernameValidate(values);

        if (Object.keys(errors).length === 0) {
          const response = await authenticate(values.username);

          if (response?.success) {
            setUsername(values.username);
            navigate('/password');
          } else {
            toast.error(response?.error || 'User does not exist');
          }
        } else {
          toast.error(errors.username);
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        toast.error('Unable to verify user. Please try again later.');
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          {/* Title Section */}
          <div className="title text-center">
            <h4 className="text-5xl font-bold">Hello Again</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500 block mx-auto">
              Explore more by connecting with us
            </span>
          </div>

          {/* Form */}
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            {/* Floating Label Input */}
            <div className="relative flex flex-col items-center gap-8 w-80 mx-auto">
              <div className="relative w-full">
                <input
                  {...formik.getFieldProps('username')}
                  id="username"
                  type="text"
                  placeholder=" "
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  className={`${styles.textbox} peer`}
                />
                <label
                  htmlFor="username"
                  className="absolute left-3 top-3 text-gray-500 transition-all 
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                             peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                             peer-focus:text-blue-500 bg-transparent px-1"
                >
                  Username
                </label>
              </div>

              {/* Submit Button */}
              <button className={styles.btn} type="submit">
                Let's Go
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a member?{' '}
                <Link className="text-red-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
