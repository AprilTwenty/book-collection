import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const endPoint = base_url + "/auth/register";

export async function register(clientData) {
    try {
        const response = await axios.post(endPoint, clientData.body);
        return response;    
    } catch (error) {
        throw error;
    }

}