import axios from 'axios';

const API = axios.create({ baseURL: '/' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const signIn = (profile) => API.post('/user/signin', profile);
export const signUp = (profile) => API.post('/user/signup', profile);
export const microsoftSignup = (profile) => API.post('/user/microsoftsignup', profile);

export const fetchEvent = (id) => API.get(`/events/${id}`);
export const fetchEventByCreatorIdDate = (date) => API.get(`/events/${date}/getEvent`);
export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, event) => API.patch(`/events/${id}`, event);
export const updateEventByCreatorIdDate = (date, event) => API.patch(`/events/${date}/updateEvent`, event);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const deleteEventByCreatorIdDate = (date) => API.delete(`/events/${date}/delEvent`);

export const getUsers = () => API.get('/users');
export const getUsersBySearch = (searchQuery) => API.get(`/users/search?searchQuery=${searchQuery}`);
export const deleteUser = (body) => API.post('/users/delete', body);
export const updateUser = (body) => API.post('/users/update', body);

export const sendMessage = (message, id) => API.post(`/events/${id}/eventMsg`, message);

export const fetchConversations = () => API.get('/conversations');
export const fetchConversation = (id) => API.get(`/conversations/${id}`);
export const updateConversation = (value, id) => API.patch(`/conversations/message/${id}`, value);
export const createConversation = (newConversation) => API.post('/conversations/conversation', newConversation);
