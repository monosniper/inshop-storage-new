import axios from 'axios';

export const API_URL = 'https://www.inshop-online.com';

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL + '/api/'
})

export const $server = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export const $apiRoutes = {
    files: {
        delete: '/files/delete',
    },
}