import axios from 'axios'


export const api = axios.create({
	baseURL: import.meta.env.PUBLIC_BACKEND_URL,
	timeout: 3000,
	headers: {}
})
