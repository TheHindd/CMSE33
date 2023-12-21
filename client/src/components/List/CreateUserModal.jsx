import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Input from '../Auth/Input';
import { signupAdmin } from '../../actions/auth';
import './Users.scss';
import '../Auth/Auth.scss';

const initialState = { firstName: '', lastName: '', email: '', password: null, confirmPassword: '', role: 'user' };

const CreateUserModal = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
   const [currentUser, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
   const [showPassword, setShowPassword] = useState(false);
   const [form, setForm] = useState(initialState);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupAdmin(form, history));
        props.close();
        setForm(initialState);
    }

    const handleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className="createChatModal">
            <div className="modal-wrapper"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                <div className="modal-header">
                    <h4>New User</h4>
                    <span className="close-modal-btn" onClick={props.close}>×</span>
                </div>

                <div className="auth__form" style={{padding: 10}}>
                    <form onSubmit={handleSubmit}>
                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus />
                        <br />
                        <Input name="lastName" label="Last Name" handleChange={handleChange} />
                        <br />
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <br />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        <br />
                        <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />
                        <br />
                        <Input name="role" label="Role" handleChange={handleChange} type="text" />
                        <br />
                        <Button type="submit" fullWidth variant="contained" color="primary" className="submit">Create Account</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateUserModal
