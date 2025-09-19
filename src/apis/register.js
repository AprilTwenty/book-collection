import axios from "axios";

const base_url = "http://localhost:4000";
const endPoint = base_url + "/auth/register";

export async function register(clientData) {
    try {
        const response = await axios.post(endPoint, clientData.body);
        return response;    
    } catch (error) {
        throw error;
    }

}