import { Outlet } from "react-router-dom";
import { SideBar } from "../Components/SideBar/SideBar";
import './Dashboard.scss'
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import { setUser } from "../Redux/userSlice";
import { UserDetails } from "../ApolloClient/Queries/Users";
import { makeToast } from "../Components/Toast/makeToast";

const DashboardLayout = () => {

    const dispatch = useDispatch();
    
    useQuery(UserDetails, {
        fetchPolicy: "network-only",
        onCompleted: (data)=>{
            if(data?.getUser)
                dispatch(setUser({user_id: data?.getUser?.user_id, name: data?.getUser?.name, email: data?.getUser?.email}));
        },
        onError: (err)=>{
            makeToast({message: `Error ${err.message}`, toastType: "error"});
        }
    });

    return (
        <div className="dashboard-layout">
            <SideBar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout;