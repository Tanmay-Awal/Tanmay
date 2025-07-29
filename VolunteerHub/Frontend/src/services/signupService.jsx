import api from "./api";

export async function registerUser({ email, password, role }) {
  const payload = {
    email: email.trim().toLowerCase(),
    password,
    role,
  };
  console.log("registerUser payload:", payload);

  try {
    const response = await api.post("/auth/register", payload);
    console.log("registerUser response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        // Handle validation errors
        if (data.message) {
          throw new Error(data.message);
        }
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Default error
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
}

export async function saveNgoDetails(ngoData) {
  const response = await api.post("/ngo/details", ngoData);
  console.log("saveNgoDetails response:", response.data);
  return response.data;
}
