import { AccountCircle, Group, Logout, NotificationsRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'
import './SideBar.scss'
import { makeToast } from '../Toast/makeToast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { setUser } from '../../Redux/userSlice';
import { useState } from 'react';
import { Confirmation } from '../Confirmation/Confirmation';
import defaultImage from '../../Assets/images/default1.jpg';

export const SideBar = () => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const user = useSelector((state: RootState)=> state.user);
    const [logoutPopupState, setLogoutPopupState] = useState<boolean>(false);
    const logout = () => {
        makeToast({message: "Log out Successfully", toastType: "success"})
        localStorage.removeItem("token");
        dispatch(setUser({name: "", email: ""}))
        setLogoutPopupState(false);
        navigate('/signin')
    }

    
    return (
        <nav>
            <div className='userProfile'>
                <img src={user?.image ? user?.image : defaultImage} alt=''/>
                <p className='user-name'>{user?.name}</p>
            </div>
            <ol>
                <li onClick={() => navigate('/groups')} >
                    <Group className='icon'/>
                    Groups
                </li>
                <li onClick={() => navigate('/profile')} >
                    <AccountCircle className='icon' /> 
                    Profile
                </li>
                <li onClick={()=> navigate('/notifications/group_requests')} >
                    <NotificationsRounded className='icon'/>
                        Notifications
                </li>
            </ol>
            <div  onClick={()=>setLogoutPopupState(true)} className='nav-footer'>
                <span>{<Logout className='icon'/>}Log out</span>
                
            </div>
            <Confirmation 
                title={'Do you want to Log out this profile ?'} 
                open={logoutPopupState} 
                onSuccess={logout} 
                onClose={()=>setLogoutPopupState(false)}
                closeButtonText={'No'} 
                confirmButtonText={'Yes'}/>
        </nav>
    )
}