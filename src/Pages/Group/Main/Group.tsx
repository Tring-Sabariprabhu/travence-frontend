import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../../Components/Header/header';
import { RootState } from '../../../Redux/store';
import { GroupData } from '../../../ApolloClient/Queries/Groups';
import { Confirmation } from '../../../Components/Confirmation/Confirmation';
import { Loader } from '../../../Components/Loader/Loader';
import './Group.scss';

export interface Group_Member_Props {
    member_id: string
    user_role: string
    joined_at: string
    updated_at: string
    deleted_at: string
    created_by: {
        email: string,
        name: string,
    }
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

    useEffect(()=>{
        navigate('groupdetails', { state: { group_id: group_id,}});
    },group_id);

    const user = useSelector((state: RootState) => state.user);
    const { data: group_data, loading, error } = useQuery(GroupData,
        {
            variables: { input: { group_id: group_id }},
            skip: !group_id,
            fetchPolicy: "network-only",
            onError: (err) => {
                console.log("Fetching Group Data failed ", err.message);
            }
        });

    const userInGroup = group_data?.group?.group_members?.find((member: Group_Member_Props) => member?.user?.user_id === user?.user_id);
    const NavItems = [
        { label: "Group", onClick: () => navigate('groupdetails', { state: { group_id: group_id,}}) },
        { label: "Trips", onClick: () => navigate('trips', { state: { group_id: group_id,}}) }
    ]
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <p>Error</p>;
    }
    return (
        <div className='group-container'>
            <Header items={NavItems} />

            {group_data?.group?.group_members?.length > 0 && !userInGroup &&
                <Confirmation
                    open={true}
                    onClose={() => navigate('/groups')}
                    title={'You are Removed From this Group'}
                    confirmButtonText={'Ok'} />}

            <div className='group-body-container'>
                <Outlet/>
            </div>
        </div>

    )
}
export default Group;