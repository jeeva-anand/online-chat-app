import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

export const getItems = async () =>
{
    const response = await api.get('/items');
    return response.data;
};

export const addItem = async (item) =>
{
    const response = await api.post('/items', item);
    return response.data;
};