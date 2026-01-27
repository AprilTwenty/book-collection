import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const endPoint = base_url + "/books"
export async function getBooks (clientData) {
    try {
        const response = await axios.get(endPoint + clientData.query + clientData.params);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getBooksById (clientData) {
    try {
        const response = await axios.get(endPoint + "/" + clientData.params);
        return response;
    } catch (error) {
        throw error;
    }
}