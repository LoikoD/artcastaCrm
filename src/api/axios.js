import axios from 'axios';
import { refreshAction, logout } from '../redux/actions';
import store from '../redux/store';

const BASE_URL = process.env.REACT_APP_ARTCASTA_API;


export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
});

const {dispatch} = store;
let requestsToRefresh = [];
let isRefreshRequesting = false;

const requestInterceptor = (config) => {
    //console.log("requestInterceptor > token: ", store.getState().navigationReducer.accessToken);
    if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${store.getState().navigationReducer.accessToken}`
    }
    return config;
}

const responseInterceptor = async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
        if (!isRefreshRequesting) {
            prevRequest.sent = true;
            isRefreshRequesting = true;
            
            try {
                const refreshResponse = await axios.get(BASE_URL + 'token/refresh', {
                    withCredentials: true
                });
                const newAccessToken = refreshResponse.data.AccessToken;
                dispatch(refreshAction(newAccessToken));    
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                requestsToRefresh.forEach((cb) => cb(newAccessToken));
            } catch (err) {
                requestsToRefresh.forEach((cb) => cb(null));
                dispatch(logout());
            } finally {
                requestsToRefresh = [];
                isRefreshRequesting = false;
                return axiosPrivate(prevRequest);
            }
        }
        return new Promise((resolve, reject) => {
            requestsToRefresh.push((token) => {
                if (token) {
                    prevRequest.headers['Authorization'] = `Bearer ${token}`;
                    resolve(axiosPrivate(prevRequest));
                }
                reject(error)
            })
        })
    }
        
    return Promise.reject(error);
}

axiosPrivate.interceptors.request.use(requestInterceptor);
axiosPrivate.interceptors.response.use(null, responseInterceptor);