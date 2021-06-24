import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Resize, DragAndDrop, Inject, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import { v1 as uuid } from "uuid";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../../actions/events";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import './Calendar.scss';

function Calendar() {
    const [id, setId] = useState('');
    const events = useSelector((state) => state.events);
    const users = useSelector((state) => state.users);
    const [currentUser, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();

    useEffect(() => {
        create();
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, []);

    const create = () => {
        setId(uuid());
    }

    const content = (props) => {
        const meetingLink = `http://localhost:3000/room/${props.MeetingId}`;
        return (
        <div>
            {props.elementType === "cell" ? (
            <div className="e-cell-content e-template">
                <form className="e-schedule-form">
                    <div>
                        <input className="subject e-field e-input" type="text" name="Subject" placeholder="Title"/>
                    </div>
                </form>
            </div>) : (
            <div>
                <div className="quickpopup__dateTime">
                    {props.StartTime.toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                    {" "}
                    {props.StartTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}
                    {" - "}
                    {props.EndTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}
                </div>
                {props.MeetingId !== "" && !isNullOrUndefined(props.MeetingId) ?
                <div>
                    <Button href={props.MeetingId} variant="contained" color="primary" className="quickpopup__join">Join</Button>
                    <div className="quickpopup__meetingId">
                        <LinkIcon />
                        <p><a href={meetingLink}>{meetingLink.slice(0, 40)}{"..."}</a></p>
                        <FileCopyOutlinedIcon />
                    </div>
                </div>: null}
                {props.Attendees.map((attendee) => {
                    return (
                        <span>{attendee}</span>
                    )
                })}
                <div className="quickpopup__description">
                    {props.Description ? props.Description.includes('>') ? props.Description.substr(0, props.Description.indexOf('<https')) : props.Description: ""}
                </div>
            </div>
            )}
        </div>
        );
    }

    const onActionBegin = (args) => {
        if (args.requestType === "eventCreate") {
            console.log(args);
            create();
            dispatch(createEvent({
                Subject: args.data[0].Subject,
                StartTime: args.data[0].StartTime.toISOString(),
                EndTime: args.data[0].EndTime.toISOString(),
                Attendees: args.data[0].Attendees,
                Description: args.data[0].Description,
                MeetingId: id
            })).then(() => {
                dispatch(getEvents());
            });
        } else if (args.requestType === "eventChange") {
            dispatch(updateEvent(args.data._id, {
                Subject: args.data.Subject,
                StartTime: args.data.StartTime.toISOString(),
                EndTime: args.data.EndTime.toISOString(),
                Attendees: args.data.Attendees,
                Description: args.data.Description,
                MeetingId: id
            }));
        } else if (args.requestType === "eventRemove") {
            dispatch(deleteEvent(args.data[0]._id))
        }
    }

    const editorTemplate = (props) => {
        return (props !== undefined && Object.keys(props).length > 0 ? 
            <table className="custom-event-editor" style={{ width: '100%', padding: '5' }}>
                <tbody>
                    <tr>
                        <td className="e-textlabel">Title</td><td colSpan={4}>
                            <input id="Subject" className="e-field e-input" type="text" name="Subject" placeholder="Subject" style={{ width: '100%' }}/>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Attendees</td><td colSpan={4}>
                            <MultiSelectComponent
                                className="e-field"
                                placeholder='Add attendees'
                                data-name="Attendees"
                                dataSource={users.filter(user => user._id !== currentUser.result._id)}
                                fields={{ text: 'name', value: '_id' }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Start</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field" />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">End</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field" />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Description</td><td colSpan={4}>
                            <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }} />
                        </td>
                    </tr>
                </tbody>
            </table> 
        : <div></div>);
    }

    return (
        <ScheduleComponent
            width="100%"
            height="85.7vh"
            selectedDate={new Date()}
            enablePersistence={true}
            actionBegin={onActionBegin}
            eventSettings={{ dataSource: events }}
            quickInfoTemplates={{ content: content }}
            editorTemplate={editorTemplate}
        >
            <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="Week" />
                <ViewDirective option="WorkWeek" />
            </ViewsDirective>
            <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]} />
        </ScheduleComponent>
    );
}

export default Calendar;