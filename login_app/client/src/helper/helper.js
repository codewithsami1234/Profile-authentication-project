import axios from 'axios';

// ✅ Set live backend URL for GitHub Pages deployment
export const API_URL = process.env.REACT_APP_SERVER_DOMAIN || "https://your-backend.onrender.com";

// Use API_URL for all requests
const api = axios.create({
  baseURL: API_URL,
});

/** Authenticate username */
export async function authenticate(username) {
  if (!username) return { error: "Username is required!" };
  try {
    const response = await api.post('/api/authenticate', { username });
    return { success: true, status: response.status, data: response.data };
  } catch {
    return { error: "User does not exist or server error!" };
  }
}

/** Get user details */
export async function getUsername(username) {
  try {
    if (!username) username = localStorage.getItem('username');
    if (!username) return { error: "Username not found!" };
    const { data } = await api.get(`/api/user/${username}`);
    return data;
  } catch {
    return { error: "Couldn't fetch user details!" };
  }
}

/** Register user */
export async function registerUser(credentials) {
  try {
    const { data, status } = await api.post('/api/register', credentials);
    const msg = data?.msg || "Registration successful!";

    if (status === 201) {
      const { username, email } = credentials;
      await api.post('/api/registerMail', { username, userEmail: email, text: msg });
    }

    return { success: true, msg: "User registered successfully!" };
  } catch {
    return { error: "User registration failed!" };
  }
}

/** Verify password */
export async function verifyPassword({ username, password }) {
  if (!username || !password) throw new Error("Username and password are required!");
  try {
    const { data, status } = await api.post('/api/login', { username, password });
    return { success: true, data, status };
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Password Not Match!");
  }
}

/** Update user profile */
export async function updateUser(response) {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { error: "No authorization token found!" };
    const { data } = await api.put('/api/updateuser', response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data };
  } catch {
    return { error: "Couldn't update profile!" };
  }
}

/** Generate OTP */
export async function generateOTP(username) {
  try {
    const user = await getUsername(username);
    const userEmail = user?.email;
    if (!userEmail) return { error: "User email not found!" };

    const { data, status } = await api.get(`/api/generateOTP?username=${username}`);
    if (status === 201 && data?.code) {
      await api.post('/api/registerMail', {
        username,
        userEmail,
        text: `Your password recovery OTP is ${data.code}.`,
        subject: 'Password Recovery OTP',
      });
    }
    return { success: true, data };
  } catch {
    return { error: "Failed to generate OTP!" };
  }
}

/** Verify OTP */
export async function verifyOTP({ username, code }) {
  if (!code) return { error: "OTP code is required!" };
  try {
    const { data, status } = await api.get(`/api/verifyOTP?username=${username}&code=${code}`);
    return { success: true, data, status };
  } catch {
    return { error: "Failed to verify OTP!" };
  }
}

/** Reset password */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await api.put(`/api/resetPassword`, { username, password });
    return { success: true, data, status };
  } catch {
    return { error: "Failed to reset password!" };
  }
}

/** Create reset session */
export async function createResetSession() {
  try {
    const { data, status } = await api.get(`/api/createResetSession`);
    return { success: true, data, status };
  } catch {
    return { error: "Failed to create reset session!" };
  }
}
