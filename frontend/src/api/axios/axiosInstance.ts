import axios from 'axios';
import baseAxiosConfig from './baseAxiosConfig';

const axiosInstance = axios.create(baseAxiosConfig);

export default axiosInstance;