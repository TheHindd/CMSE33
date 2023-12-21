import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

const User = ({ user }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const goToUser = (id) => {
        history.push(`/admin/${id}`)
    }

    return (
        <div key={user._id} className="chatroom__item" onClick={() => {goToUser(user._id)}}>
            <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
            <div className="chatroom__info">
                <div className="chatRoom__title">
                    <h6>{user.name.toUpperCase()}</h6>
                    <h6>{user.email}</h6>
                </div>
                <div className="chatroom__message">
                    <p>{user.role || "-"}</p>
                </div>
            </div>
        </div>
    );
}

export default User
