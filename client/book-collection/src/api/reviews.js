import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const endPoint = base_url + "/reviews";

export async function getReviewById (id) {
    const response = await axios.get(`${endPoint}/${id}`);
    return response;
}

export async function getReviewsByBookId(bookId) {
    return axios.get(`${endPoint}?book_id=${bookId}`, {
        withCredentials: true
    });
}

export async function createReview(clientData) {

    const response = await axios.post(endPoint, clientData, {
        withCredentials: true
    });
    return response;
    
}