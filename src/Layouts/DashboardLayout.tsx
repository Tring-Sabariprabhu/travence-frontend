import { Outlet, useNavigate } from "react-router-dom";
import { SideBar } from "../Components/SideBar/SideBar";
import './Dashboard.scss'
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import { setUser } from "../Redux/userSlice";
import { GetCurrentUser } from "../ApolloClient/Queries/Users";
import { Loader } from "../Components/Loader/Loader";
import { makeToast } from "../Components/Toast/makeToast";

const DashboardLayout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const {loading, error} = useQuery(GetCurrentUser, {
        fetchPolicy: "network-only",
        onCompleted: (data)=>{
            if(data?.getAuthUser)
                dispatch(setUser(
                        {
                            user_id: data?.getAuthUser?.user_id, 
                            name: data?.getAuthUser?.name, 
                            email: data?.getAuthUser?.email, 
                            password: data?.getAuthUser?.password,
                            image: data?.getAuthUser?.image}));
        },
        onError: (err)=>{
            makeToast({message: err.message, toastType: "error"});
            localStorage.removeItem("token");
            navigate('/signin');
        }
    });
    if (loading) {
        return <Loader/>;
    }
    if(error){
        return <p>Error</p>;
    }
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