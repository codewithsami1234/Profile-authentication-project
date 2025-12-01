import axios from 'axios';

// ✅ Base URL for Vercel deployment (relative paths work with serverless functions)
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN || "";

/** Authenticate username */
export async function authenticate(username) {
  if (!username) return { error: "Username is required!" };

  try {
    const response = await axios.post('/api/authenticate', { username });
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return { error: error.response?.data?.msg || "User does not exist or server error!" };
  }
}

/** Get user details */
export async function getUsername(username) {
  try {
    if (!username) {
      username = localStorage.getItem('username');
    }
    if (!username) return { error: "Username not found!" };

    const { data } = await axios.get(`/api/user/${username}`);
    return data;
  } catch (error) {
    return { error: error.response?.data?.msg || "Couldn't fetch user details!" };
  }
}

/** Register user */
export async function registerUser(credentials) {
  try {
    const { data, status } = await axios.post('/api/register', credentials);
    if (status === 201) {
      const { username, email } = credentials;
      await axios.post('/api/registerMail', {
        username,
        userEmail: email,
        text: data?.msg || "Registration successful!",
      });
    }
    return { success: true, msg: data?.msg || "User registered successfully!" };
  } catch (error) {
    return { error: error.response?.data?.msg || "User registration failed!" };
  }
}

/** Verify password */
export async function verifyPassword({ username, password }) {
  if (!username || !password) throw new Error("Username and password are required!");

  try {
    const { data } = await axios.post(`/api/login`, { username, password });
    return { success: true, data };
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Password Not Match!");
  }
}

/** Update user profile */
export async function updateUser(response) {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { error: "No authorization token found!" };

    const { data } = await axios.put('/api/updateuser', response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data };
  } catch (error) {
    return { error: error.response?.data?.msg || "Couldn't update profile!" };
  }
}

/** Generate OTP */
export async function generateOTP(username) {
  try {
    const user = await getUsername(username);
    const userEmail = user?.email;
    if (!userEmail) return { error: "User email not found!" };

    const { data, status } = await axios.get(`/api/generateOTP?username=${username}`);

    if (status === 201 && data?.code) {
      await axios.post('/api/registerMail', {
        username,
        userEmail,
        text: `Your password recovery OTP is ${data.code}.`,
        subject: 'Password Recovery OTP',
      });
    }

    return { success: true, data };
  } catch (error) {
    return { error: error.response?.data?.msg || "Failed to generate OTP!" };
  }
}

/** Verify OTP */
export async function verifyOTP({ username, code }) {
  if (!code) return { error: "OTP code is required!" };

  try {
    const { data } = await axios.get(`/api/verifyOTP?username=${username}&code=${code}`);
    return { success: true, data };
  } catch (error) {
    return { error: error.response?.data?.msg || "Failed to verify OTP!" };
  }
}

/** Reset password */
export async function resetPassword({ username, password }) {
  try {
    const { data } = await axios.put(`/api/resetPassword`, { username, password });
    return { success: true, data };
  } catch (error) {
    return { error: error.response?.data?.msg || "Failed to reset password!" };
  }
}

/** Create reset session */
export async function createResetSession() {
  try {
    const { data } = await axios.get(`/api/createResetSession`);
    return { success: true, data };
  } catch (error) {
    return { error: error.response?.data?.msg || "Failed to create reset session!" };
  }
}
