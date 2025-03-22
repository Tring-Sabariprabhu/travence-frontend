import { Outlet, useNavigate } from "react-router-dom";
import { SideBar } from "../Components/SideBar/SideBar";
import './Dashboard.scss'
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import { setUser } from "../Redux/userSlice";
import { UserDetails } from "../ApolloClient/Queries/Users";
import { makeToast } from "../Components/Toast/makeToast";

const DashboardLayout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useQuery(UserDetails, {
        fetchPolicy: "network-only",
        onCompleted: (data)=>{
            if(data?.getAuthUser)
                dispatch(setUser({user_id: data?.getAuthUser?.user_id, name: data?.getAuthUser?.name, email: data?.getAuthUser?.email}));
        },
        onError: (err)=>{
            // makeToast({message: `Error to Load User data`, toastType: "error"});
            localStorage.removeItem("token");
            navigate('/signin');
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