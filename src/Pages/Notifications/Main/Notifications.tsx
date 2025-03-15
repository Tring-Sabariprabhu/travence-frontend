import { Header } from '../../../Components/Header/header';
import './Notifications.scss'

import { Outlet, useNavigate } from 'react-router-dom'

export const Notifications = ()=>{
    const navigate = useNavigate();
    return(
        <div className="left-main-container notification-container">
            <Header items={[
                {label: "Group Requests", onClick: ()=>{navigate('group_requests')}},
                {label: "Trip Requests", onClick: ()=>{navigate('trip_requests')}},
            ]}/>
            <Outlet/>
        </div>
    )
}