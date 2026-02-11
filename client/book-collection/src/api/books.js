import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const endPoint = base_url + "/books"
export async function getLatestBooks (limit = 10) {
    const respone = await axios.get(`${endPoint}/latest?limit=${limit}`);
    return respone;
}

export async function getBooks (sortQuery = {}) {
    const response = await axios.get(endPoint, { params: sortQuery });
    return response;
}

export async function getBooksById (id) {
    const response = await axios.get(`${endPoint}/${id}`);
    return response;
}
