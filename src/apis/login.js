import axios from "axios";

const base_url = "http://localhost:4000";
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