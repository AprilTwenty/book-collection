import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const endPoint = base_url + "/auth/login";

export async function login(clientData) {
    try {
        const response = await axios.post(endPoint, clientData.body);
        const token = response.data.token;
        localStorage.setItem('token', token);
        return response
    } catch (error) {
        throw error;
    }
}