import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Components/Header/header";
import { RootState } from "../../Redux/store";
import AddGroup from "./AddGroup/AddGroup";
import './GroupList.scss';
import {  GroupOutlined, MoreVert } from "@mui/icons-material";
import { GroupsList } from "../../ApolloClient/Queries/Groups";
import { Loader } from "../../Components/Loader/Loader";
import { DataNotFound } from "../../Components/DataNotFound/DataNotFound";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";
import { makeToast } from "../../Components/Toast/makeToast";
import { DeleteGroup } from "../../ApolloClient/Mutation/Groups";
import { Confirmation } from "../../Components/Confirmation/Confirmation";
import { Menu, MenuItem } from "@mui/material";


interface GroupDataProps {
    group_id: string,
    group_name: string,
    group_description: string,
    created_at: string,
    deleted_at: string,
    updated_at: string,
    created_by: {
        user_id: string,
        name: string,
        email: string
    }
}

export const GroupList = () => {

    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const [openAddgroup, setOpenAddgroup] = useState<boolean>(false);
    const [editGroupPopupState, setEditGroupPopupState] = useState<boolean>(false);

    const [deleteGroupConfirm, setDeleteGroupConfirm] = useState<boolean>(false);
    const [deleteGroup] = useMutation(DeleteGroup);

    const { data, loading, error, refetch: refetchGroupListData } = useQuery(GroupsList,
        {
            skip: !user?.user_id,
            fetchPolicy: "network-only"
        });
    const [selectedGroup, setSelectedGroup] = useState({ group_id: "", group_name: "" });
    const navItems = [
        { label: `Create Group`, onClick: () => setOpenAddgroup(true) },
    ];


    const deleteGroupProcess = async () => {
        setDeleteGroupConfirm(false);
        await deleteGroup(
            {
                variables: {
                    input: {
                        group_id: selectedGroup?.group_id
                    }
                },
                onCompleted: (data) => {
                    makeToast({ message: data?.deleteGroup, toastType: "success" });
                    refetchGroupListData();
                },
                onError: (err) => {
                    makeToast({ message: err?.message, toastType: "error" });
                }
            });
    }
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const [menuOpenState, setMenuOpenState] = useState<boolean>(false);
    const handleMenu = (event: React.MouseEvent<HTMLElement>, group: GroupDataProps) => {
        setSelectedGroup(
            {
                group_id: group?.group_id, 
                group_name: group?.group_name
            },
        );
        event?.stopPropagation();
        setAnchorEl(event?.currentTarget);
        setMenuOpenState(true);
    }
    const closeMenu=()=>{
        setMenuOpenState(false);
    }
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage />;
    }
    return (
        <div className="grouplist-container">
            <Header items={navItems} />
            <main>
                {data?.groupList?.length > 0 ? data?.groupList?.map((group: GroupDataProps) => (
                    <div className='group'
                        key={group.group_id}
                        onClick={() => {
                            navigate(`/group/group-details`,
                                {
                                    state: {
                                        group_id: group?.group_id,
                                    }
                                }
                            )
                        }}>
                        <div className="dropdown-item">
                            <span onClick={(event)=>{handleMenu(event, group)}}>
                                <MoreVert />
                            </span>
                        </div>
                        <div >
                            <GroupOutlined className="icon" />
                        </div>
                        <div>
                            <h4>Group name </h4>
                            <p>{group.group_name}</p>
                        </div>
                        <div>
                            <h4>Created by</h4>
                            <p>{user?.user_id === group?.created_by?.user_id ? "You" : group?.created_by?.name}</p>
                        </div>
                    </div>)) : <DataNotFound />}
            </main>
            <AddGroup
                open={openAddgroup}
                onClose={() => setOpenAddgroup(false)}
                onUpdated={refetchGroupListData}
            />
            <AddGroup
                open={editGroupPopupState}
                onClose={() => setEditGroupPopupState(false)}
                group_id={selectedGroup?.group_id}
                onUpdated={refetchGroupListData} />
            <Confirmation
                open={deleteGroupConfirm}
                onClose={() => setDeleteGroupConfirm(false)}
                title={"Do you want to delete this Group ?"}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"}
                onSuccess={deleteGroupProcess} />
            <Menu open={menuOpenState}
                onClose={() => setMenuOpenState(false)}
                anchorEl={anchorEl}>
                <MenuItem onClick={() => {
                    setEditGroupPopupState(true);
                    closeMenu();
                }}>Edit</MenuItem>
                <MenuItem onClick={() => {
                    setDeleteGroupConfirm(true);
                    closeMenu();
                }}>Delete</MenuItem>
            </Menu>
        </div>
    )
}
