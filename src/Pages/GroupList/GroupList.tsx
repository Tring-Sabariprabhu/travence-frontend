import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Components/Header/header";
import { RootState } from "../../Redux/store";
import AddGroup from "../Group/GroupDetails/AddGroup/AddGroup";
import './GroupList.scss';
import { GroupOutlined } from "@mui/icons-material";
import { GroupsList } from "../../ApolloClient/Queries/Groups";
import { Loader } from "../../Components/Loader/Loader";


interface GroupDataProps {
    group_id: number,
    name: string,
    created_user_email: string,
    created_user_name: string,
    created_at: string
}

export const GroupList = () => {
    
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const [openAddgroup, setOpenAddgroup] = useState<boolean>(false);
    const {data, loading, error, refetch: refetchGroupListData} = useQuery(GroupsList, 
        {   variables: {user_id: user?.user_id}, 
            fetchPolicy: "network-only"
            })

    if(loading){
        return <Loader/>;
    }
    if(error){
        return <p>Error</p>
    }
    const navItems = [
        { label: `Create Group`, onClick: () => setOpenAddgroup(true)},
    ];

    return (
        <div className="grouplist-container">
            <Header items={navItems} />
            <main>
            {data?.groupList?.length > 0 ? data?.groupList?.map((group: GroupDataProps) => (
                <div title='Click to view' key={group.group_id} className='group'
                    onClick={() => navigate(`/group`, { state: { group_id: group.group_id, group_name: group.name } })}>    
                    <div >
                        <GroupOutlined className="icon"/>
                    </div>
                    <div >
                        <h3>Group name </h3>
                        <p>{group.name}</p>
                    </div>
                    <div>
                        <h3>Owner</h3>
                        <p>{user?.email === group?.created_user_email ? "You" : group?.created_user_name }</p>
                    </div>
                </div>))   :  <p>No Groups found</p>}
            </main>
            <AddGroup  
                open={openAddgroup} 
                onClose={() => setOpenAddgroup(false)}
                onUpdated={refetchGroupListData}
            />
        </div>
    )
}