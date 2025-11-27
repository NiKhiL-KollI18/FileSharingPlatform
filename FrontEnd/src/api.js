// For local testing, point to your Spring Boot port.
// When deploying to AWS, change this to your Load Balancer URL.
const API_BASE = "";

// Generic API call function
async function callApi(method, url, data = null, isFile = false) {
    // 1. Get the token from storage
    const token = localStorage.getItem('token');

    const headers = {};

    // 2. If we have a token, stamp it on the request!
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. Set Content-Type (unless it's a file upload, which sets its own)
    if (!isFile) {
        headers["Content-Type"] = "application/json";
    }

    const options = {
        method,
        headers, // Attach our headers
    };

    if (data) {
        options.body = isFile ? data : JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${url}`, options);

        if (!response.ok) {
            const errText = await response.text();
            // Handle 403 Forbidden specifically (Token expired or invalid)
            if (response.status === 403) {
                console.error("Access Forbidden. Token might be invalid.");
                // Optional: Trigger a logout here if you want to be fancy
            }
            throw new Error(`${response.status} ${response.statusText} - ${errText}`);
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Auth endpoints
export const signup = (userData) => callApi("POST", "/auth/signup", userData);
export const login = (credentials) => callApi("POST", "/auth/login", credentials);

// File endpoints
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return callApi("POST", "/files/upload", formData, true);
};

export const getFiles = () => callApi("GET", "/files");
export const deleteFile = (fileId) => callApi("DELETE", `/files/delete/${fileId}`);
export const generateShareLink = (fileId) => callApi("POST", `/files/share/${fileId}`);