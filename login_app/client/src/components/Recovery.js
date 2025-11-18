import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';

export default function Recovery() {
  const { username: storeUsername } = useAuthStore((state) => state.auth);
  const username = storeUsername || localStorage.getItem('username');
  const [OTP, setOTP] = useState('');
  const navigate = useNavigate();

  /** Generate OTP when component loads */
  useEffect(() => {
    if (!username) {
      toast.error('Username not found!');
      return;
    }

    const sendOTP = async () => {
      try {
        const otp = await generateOTP(username);
        if (otp?.success) toast.success('OTP has been sent to your email!');
        else toast.error('Problem while generating OTP!');
      } catch {
        toast.error('Error sending OTP!');
      }
    };

    sendOTP();
  }, [username]);

  /** Handle OTP verification */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!OTP || OTP.trim().length < 4) {
      toast.error('Please enter a valid OTP!');
      return;
    }

    try {
      const { status } = await verifyOTP({ username, code: OTP.trim() });
      if (status === 201) {
        toast.success('Verified successfully!');
        navigate('/reset');
      } else {
        toast.error('Wrong OTP! Check your email again!');
      }
    } catch {
      toast.error('Verification failed!');
    }
  };

  /** Resend OTP handler */
  const resendOTP = async () => {
    try {
      const sendPromise = generateOTP(username);
      toast.promise(sendPromise, {
        loading: 'Sending...',
        success: <b>OTP has been sent to your email!</b>,
        error: <b>Could not send it!</b>,
      });
    } catch {
      toast.error('Could not send OTP!');
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title text-center">
            <h4 className="text-5xl font-extrabold text-blue-600">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500 block mx-auto">
              Enter the OTP to recover your password.
            </span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>
            <div className="profile flex flex-col justify-center items-center py-4 gap-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
              <span className="text-sm text-gray-500 text-center">
                Enter the 6-digit OTP sent to your registered email.
              </span>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Floating Label OTP Input (same style as Reset.js) */}
              <div className="relative w-3/4">
                <input
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                  id="otp"
                  type="text"
                  maxLength={6}
                  className={`${styles.textbox} peer text-center`}
                  placeholder=" "
                />
                <label
                  htmlFor="otp"
                  className="absolute left-3 top-3 text-gray-500 transition-all 
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                             peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm 
                             peer-focus:text-blue-500 bg-transparent px-1"
                >
                  Enter OTP
                </label>
              </div>

              <button className={styles.btn} type="submit">
                Verify OTP
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Didn’t get OTP?{' '}
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-red-500 hover:underline"
                >
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
