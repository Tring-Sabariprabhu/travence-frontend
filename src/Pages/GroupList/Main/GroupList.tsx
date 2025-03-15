import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../Components/Header/header";
import { RootState } from "../../../Redux/store";
import AddGroup from "../../Group/AddGroup/AddGroup";
import './GroupList.scss';
import { GroupOutlined } from "@mui/icons-material";
import { GroupsList } from "../../../ApolloClient/Queries/Groups";

interface GroupDataProps {
    group_id: number,
    name: string,
    created_user_email: string,
    created_at: string
}

export const GroupList = () => {
    
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const [openAddgroup, setOpenAddgroup] = useState<boolean>(false);
    const {data, loading, error, refetch: refetchGroupListData} = useQuery(GroupsList, {variables: {user_id: user?.user_id} , fetchPolicy: "network-only"})

    const navItems = [
        { label: `Create Group`, onClick: () => setOpenAddgroup(true)},
    ];
    if(loading){
        <p>Loading..</p>;
    }
    if(error){
        <p>Error</p>
    }
    return (
        <div className='left-main-container grouplist-container'>
            <Header items={navItems} />
            <main>
            {data?.groupList?.length === 0 && <p>No Groups found</p>}
            {data?.groupList && data?.groupList?.map((group: GroupDataProps) =>
            (   <div title='Click to view' key={group.group_id} className='group'
                    onClick={() => navigate(`/group`, { state: { group_id: group.group_id, group_name: group.name } })}>    
                    <div >
                        <GroupOutlined className="icon"/>
                    </div>
                    <div >
                        <h3>Group name </h3>
                        <p>{group.name}</p>
                    </div>
                    <div>
                        <h3>Created_by</h3>
                        <p>{user?.email === group?.created_user_email ? "You" : group?.created_user_email }</p>
                    </div>
                </div>  ))}
            </main>
            <AddGroup  onUpdated={() => refetchGroupListData()}
                open={openAddgroup} onClose={() => setOpenAddgroup(false)}
            />
        </div>
    )
}