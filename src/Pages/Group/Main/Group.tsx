import { gql, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../../Components/Header/header';
import { RootState } from '../../../Redux/store';
import { Confirmation } from '../../../Components/Confirmation/Confirmation';
import { Loader } from '../../../Components/Loader/Loader';
import './Group.scss';
import { ErrorPage } from '../../../Components/ErrorPage/ErrorPage';

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

    const GroupData = gql`
        query get($input: GroupInput!){
            group(input: $input){
                group_id,
                group_name,
                group_description,
                group_members{
                    user{
                        user_id
                    }
                }
            }
        }
    `
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
        { label: "Group", onClick: () => navigate('group-details', 
            { 
                state: { 
                    group_id: group_id, 
                    admin_id: userInGroup?.member?.member_id
                }
            }
        ) },
        { label: "Trips", onClick: () => navigate('trips', 
            { 
                state: { 
                    group_id: group_id, 
                    admin_id: userInGroup?.member?.member_id
                }
            }
            ) },
    ]
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage/>;
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