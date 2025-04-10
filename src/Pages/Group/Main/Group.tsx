import {  useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../../Components/Header/header';
import { RootState } from '../../../Redux/store';
import { Confirmation } from '../../../Components/Confirmation/Confirmation';
import { Loader } from '../../../Components/Loader/Loader';
import './Group.scss';
import { ErrorPage } from '../../../Components/ErrorPage/ErrorPage';
import { makeToast } from '../../../Components/Toast/makeToast';
import { GroupMemberDetails } from '../../../ApolloClient/Queries/Groups';
import { setUser } from '../../../Redux/userSlice';

export interface Group_Member_Props {
    member_id: string
    user_role: string
    joined_at: string
    updated_at: string
    deleted_at: string
    user: {
        name: string,
        email: string,
        user_id: string
    }
}

const Group = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const group_id = location?.state?.group_id;

    const user = useSelector((state: RootState) => state.user);
    const { data: userInGroup, loading, error } = useQuery(GroupMemberDetails,
        {
            variables: {
                input: {
                    group_id: group_id
                }
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        },
    );

    
    const NavItems = [
        {
            label: "Group", onClick: () => navigate('group-details',
                {
                    state: {
                        group_id: group_id,
                        member_id: userInGroup?.groupMember?.member_id
                    }
                }
            )
        },
        {
            label: "Trips", onClick: () => navigate('trips',
                {
                    state: {
                        group_id: group_id,
                        member_id: userInGroup?.groupMember?.member_id
                    }
                }
            )
        },
    ]
    const dispatch = useDispatch();
    useQuery(GroupMemberDetails, {
       variables: {
           input: {
               group_id: group_id,
           }
       },
       onCompleted(data) {
           dispatch(setUser({...user, current_group_member_id: data?.groupMember?.member_id, 
            group_id: group_id
           }))
       },
   })
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage />;
    }
    
    return (
        <div className='group-container'>
            <Header items={NavItems} />
            
        {!userInGroup 
            &&
            <Confirmation
                    open={true}
                    onClose={() => navigate('/groups')}
                    title={'You are Removed From this Group'}
                    confirmButtonText={'Ok'} />}

            <div className='group-body-container'>
                <Outlet />
            </div>
        </div>

    )
}
export default Group;