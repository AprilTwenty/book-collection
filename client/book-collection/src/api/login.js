import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const endPoint = base_url + "/auth/login";

export async function login(clientData) {
    const response = await axios.post(endPoint, clientData, {
        withCredentials: true
    });

    return response;
}