import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../actions/users';
import './Users.scss';
import '../Auth/Auth.scss';

const UserModify = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users);    
    const [userModify, setUserModify] = useState({});
    const [message, setMessage] = useState('');
    const { userId } = useParams();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);
    
    useEffect(() => {
        users.forEach(user => {
            if (user._id === userId) {
                setUserModify(user);
                setMessage({ value: user.role, label: user.role });
            }
        });
    }, [userId]);

    const handleChange = (e) => {
        setMessage(e);
    }

    const handleSubmit = (e) => {
        if (message) {
            dispatch(updateUser(message, userId));
            setMessage('');
        }   
    }

    if (userId) {
        return (
            <div>
                <div className="user-center">
                    <h4>{ userModify.name }</h4>
                    <h4>{ userModify.role || '-' }</h4>
                    <br />
                    <br />
                    <h6>Roles</h6>
                    <div>
                        <Select 
                            defaultValue={message}
                            options={[
                                { value: "admin", label: "admin" },
                                { value: "staff", label: "staff" },
                                { value: "user", label: "user" },
                            ]}
                            onChange={handleChange}
                        />                        
                        <button className="btn-continue" onClick={() => {handleSubmit()}}>Save</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="emptychat">
                <h4>Select user to perform account changes.</h4>
            </div>
        )
    }
}

export default UserModify
