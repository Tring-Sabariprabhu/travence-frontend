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
import { DataNotFound } from "../../Components/DataNotFound/DataNotFound";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";


interface GroupDataProps {
    group_id: number,
    group_name: string,
    group_description: string,
    created_at: string,
    deleted_at: string,
    updated_at: string,
    created_by:{
        name: string,
        email: string
    }
}

export const GroupList = () => {

    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const [openAddgroup, setOpenAddgroup] = useState<boolean>(false);
    const { data, loading, error, refetch: refetchGroupListData } = useQuery(GroupsList,
        {
            variables: { input: { user_id: user?.user_id }},
            fetchPolicy: "network-only"
        })

    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage/>;
    }
    const navItems = [
        { label: `Create Group`, onClick: () => setOpenAddgroup(true) },
    ];

    return (
        <div className="grouplist-container">
            <Header items={navItems} />
            <main>
                {data?.groupList?.length > 0 ? data?.groupList?.map((group: GroupDataProps) => (
                    <div className='group'  
                        key={group.group_id} 
                        title='Click to view'
                        onClick={() => navigate(`/group/group-details`, 
                            {
                                 state: { 
                                    group_id: group.group_id, 
                                    group_name: group.group_name 
                                    } 
                                }
                            )}>
                        <div >
                            <GroupOutlined className="icon" />
                        </div>
                        <div>
                            <h3>Group name </h3>
                            <p>{group.group_name}</p>
                        </div>
                        <div>
                            <h3>Owner</h3>
                            <p>{user?.email === group?.created_by?.email ? "You" : group?.created_by?.name}</p>
                        </div>
                    </div>)) : <DataNotFound message={"Groups"} />}
            </main>
            <AddGroup
                open={openAddgroup}
                onClose={() => setOpenAddgroup(false)}
                onUpdated={refetchGroupListData}
            />
        </div>
    )
}