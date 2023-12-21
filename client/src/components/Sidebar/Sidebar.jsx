import React, { useEffect, useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Sidebar.scss';
import SidebarItem from './SidebarItem';
import calendar from '../../assets/calendar.svg';
import chat from '../../assets/chat.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { v1 as uuid } from 'uuid';
import { getAccessToken } from '../../api/github';
import LoginGithub from 'react-login-github';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../actions/events';
import moment from 'moment';

function Sidebar() {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('git_oauth')));
    const location = useLocation();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [videoId, setVideoId] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    useEffect(() => {
        setAuth(JSON.parse(localStorage.getItem('git_oauth')));
    }, [location]);

    const onSuccess = async (response) => {
        const result = await getAccessToken(response.code);
        console.log(result);
        localStorage.setItem('git_oauth', JSON.stringify(result));
    }
    const onFailure = response => console.error(response);

    const createId = () => {
        const id = uuid();
        history.push(`/board/${id}`);
    }

    const createNewEvent = () => {
        const meetingId = uuid();
        setVideoId(meetingId);
        dispatch(createEvent({
            Subject: `Meeting on ${moment(new Date()).format("DD/MM/YYYY")}`,
            StartTime: new Date(),
            EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
            _id: meetingId,
            Creator: currentUser.result.name,
            CreatorId: currentUser.result._id,
        }));
    }

    return (
        <div className="sidebar">
            <Link to={`/room/${videoId}`} target="_blank">
                <div onClick={() => { createNewEvent() }}>
                    <SidebarItem
                        icon="https://img.icons8.com/ios/36/000000/video-conference.png"
                        text="New Meeting"
                        hoverIcon="https://img.icons8.com/ios/36/6264A7/video-conference.png"
                    />
                </div>
            </Link>
            <Link to="/chat">
                <SidebarItem
                    icon="https://img.icons8.com/fluent-systems-regular/48/000000/chat-message.png"
                    text="Group"
                    hoverIcon={chat}
                />
            </Link>
            {
                (currentUser.result.role && currentUser.result.role == "admin") && 
                <Link to="/admin">
                    <SidebarItem
                        icon="https://img.icons8.com/fluent-systems-regular/48/000000/settings.png"
                        text="Admin"
                        hoverIcon="https://img.icons8.com/fluent-systems-regular/48/000000/settings.png"
                    />
                </Link>
            }

            <div className="sidebarItem">
                <MoreHorizIcon />
            </div>
        </div>
    )
}

export default Sidebar
