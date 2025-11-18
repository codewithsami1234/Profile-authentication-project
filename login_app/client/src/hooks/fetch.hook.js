import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUsername } from '../helper/helper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN || "http://localhost:8080";

/** Custom hook for API fetching */
export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        // ✅ Retrieve username if needed
        const userResponse = await getUsername().catch(() => null);
        const username = userResponse?.username || localStorage.getItem('username');

        // ✅ Token for authorization
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // ✅ Determine correct API endpoint
        const url =
          query && query.startsWith('/')
            ? `/api${query.replace(/^\/api/, '')}`
            : username
            ? `/api/user/${username}`
            : null;

        if (!url) {
          setData({
            isLoading: false,
            apiData: undefined,
            status: null,
            serverError: "Invalid request: Missing username or query!",
          });
          return;
        }

        // ✅ Fetch data
        const { data, status } = await axios.get(url, { headers });

        setData({
          isLoading: false,
          apiData: data,
          status,
          serverError: null,
        });
      } catch (error) {
        setData({
          isLoading: false,
          apiData: undefined,
          status: error?.response?.status || null,
          serverError: error?.response?.data?.error || error.message || "Server error!",
        });
      }
    };

    fetchData();
  }, [query]);

  return [getData, setData];
}
