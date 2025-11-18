import React, { useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { toast, Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { verifyPassword } from '../helper/helper';

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);

  const [{ isLoading, apiData, status, serverError }] = useFetch(
    username ? `/api/user/${username}` : null
  );

  useEffect(() => {
    console.log(apiData);
  }, [apiData]);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!username) return toast.error('Username not found!');

      try {
        const loginPromise = verifyPassword({
          username,
          password: values.password,
        });

        toast.promise(loginPromise, {
          loading: 'Checking...',
          success: <b>Login Successfully!</b>,
          error: (err) => <b>{err.message || 'Password Not Match!'}</b>,
        });

        const res = await loginPromise;
        if (res?.data?.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/profile');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Unable to login. Please try again.');
      }
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  if (status && status !== 200) return <Navigate to="/" replace />;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title text-center">
            <h4 className="text-5xl font-bold">
              Hello {apiData?.firstName || apiData?.username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500 block mx-auto">
              Explore More by connecting with us
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                className={styles.profile_img}
                alt="avatar"
              />
            </div>

            {/* Floating Label Input */}
            <div className="relative flex flex-col items-center gap-8 w-80 mx-auto">
              <div className="relative w-full">
                <input
                  {...formik.getFieldProps('password')}
                  id="password"
                  className={`${styles.textbox} peer`}
                  type="password"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-3 text-gray-500 transition-all 
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                             peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                             peer-focus:text-blue-500 bg-transparent px-1"
                >
                  Password
                </label>   
              </div>

              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot password?{' '}
                <Link className="text-red-500" to="/recovery">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
