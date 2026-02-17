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
export async function getReviews (sortQuery = {}) {
    const response = await axios.get(endPoint, { params: sortQuery }, {
        withCredentials: true
    });
    return response;
}

export async function createReview(clientData) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    return axios.post(`${endPoint}`, clientData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export async function updateReview(reviewId, clientData) {
    const token = localStorage.getItem("token");

    return axios.put(
        `${endPoint}/${reviewId}`,
        clientData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}
