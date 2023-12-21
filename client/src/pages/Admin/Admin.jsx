import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Users from '../../components/List/Users';
import UserModify from '../../components/List/UserModify';
import { useDispatch } from 'react-redux';
import { getEvents } from '../../actions/events';
import { getUsers } from '../../actions/users';
import './Admin.scss';
import { getConversations } from '../../actions/conversations';

const Admin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
        dispatch(getConversations());
        dispatch(getUsers());
    }, [dispatch]);

    return (
        <div className="admin">
            <Sidebar />
            <div className="chat__rooms">
                <Users />
                <div style={{ width: "70vw" }}>
                    <UserModify />
                </div>
            </div>
        </div>
    )
}

export default Admin
