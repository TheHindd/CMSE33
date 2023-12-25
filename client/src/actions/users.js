import * as api from '../api/index';
import { FETCH_USERS, FETCH_USERS_BY_SEARCH } from '../constants/actionTypes';

export const getUsers = () => async (dispatch) => {
    try {
        const { data } = await api.getUsers();
        dispatch({ type: FETCH_USERS, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const getUsersBySearch = (searchQuery) => async (dispatch) => {
    try {
        const { data } = await api.getUsersBySearch(searchQuery);
        dispatch({ type: FETCH_USERS_BY_SEARCH, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = (role, userId, history) => async (dispatch) => {
    try {
        const { data } = await api.updateUser({ role: role.value, _id: userId });
        history.push('/admin');
    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = (userId, history) => async (dispatch) => {
    try {
        const { data } = await api.deleteUser({ _id: userId });
        history.push('/admin');
    } catch (error) {
        console.log(error);
    }
}