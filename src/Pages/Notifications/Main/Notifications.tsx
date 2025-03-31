import { Header } from '../../../Components/Header/header';
import './Notifications.scss'

import { Outlet, useNavigate } from 'react-router-dom'

export const Notifications = ()=>{
    const navigate = useNavigate();
    return(
        <div className='notification-container'>
            <Header items={[
                {label: "Group Invites", onClick: ()=>{navigate('group-invites')}},
                {label: "Trip Invites", onClick: ()=>{navigate('trip-invites')}},
            ]}/>
            <Outlet/>
        </div>
    )
}