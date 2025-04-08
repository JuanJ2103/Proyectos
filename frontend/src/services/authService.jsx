import axios from "axios";

const API_URL = "http://127.0.0.1:8000/users/token/";

export const login = async (email, password) => {
  const response = await axios.post(API_URL, { email, password });
  if (response.data.access) {
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.reload();
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

// Decodificar token para obtener el user_id (sin librerías externas)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Función para renovar accessToken si expiró
export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await axios.post("http://127.0.0.1:8000/users/token/refresh/", { refresh });
    localStorage.setItem("accessToken", res.data.access);
    return res.data.access;
  } catch (error) {
    console.error("Error al renovar el token:", error);
    logout(); // Cierra sesión automáticamente
  }
};

// Función genérica que usa el token y lo renueva si es necesario
export const secureRequest = async (axiosConfig) => {
  let token = getAccessToken();
  axiosConfig.headers = {
    ...axiosConfig.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    return await axios(axiosConfig);
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return;
      axiosConfig.headers.Authorization = `Bearer ${newToken}`;
      return await axios(axiosConfig);
    } else {
      throw err;
    }
  }
};
