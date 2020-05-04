import axios from 'axios';

const instance = axios.create({
    baseURL:'not my firebase server tho'
});

export default instance;