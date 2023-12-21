import React, { useEffect, useState } from 'react';
import User from './User';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Users.scss'
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CreateUserModal from '../List/CreateUserModal';
import { useLocation } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

const Users = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const users = useSelector((state) => state.users);
    const [options, setOptions] = useState([]);
    const [isShowing, setIsShowing] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const openCreateUserModal = () => {
        setIsShowing(true);
        users.forEach(user => {
            if (user._id !== currentUser.result._id) {
                setOptions(prevOptions => [...prevOptions, { value: user._id, label: user.name }]);
            }
        });
    }

    const closeCreateUserModal = () => {
        setIsShowing(false);
        setOptions([]);
    }

    return (
        <div className="chatrooms">
            { isShowing ? <div onClick={() => {closeCreateUserModal()}} className="back-drop"></div> : null }
            <div className="chatrooms__header">
                <div className="header__left">
                    <h5>Users</h5>
                    <ExpandMoreIcon />
                </div>
                <div className="header__right">
                    <Tooltip title="New User">
                        <IconButton onClick={() => {openCreateUserModal()}}>
                            <img src="https://img.icons8.com/fluent-systems-regular/48/000000/add.png" alt="new group" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="chatrooms__rooms">
                {users.map((user) => {
                    return (
                        <User key={user._id} user={user} />
                    )
                })}
            </div>
            <CreateUserModal className="modal" show={isShowing} close={closeCreateUserModal} options={options} />
        </div>
    )
}

export default Users