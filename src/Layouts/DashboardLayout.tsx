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
    const token = localStorage.getItem("token");
    const { loading, error } = useQuery(GetCurrentUser,
        {
            variables: {
                token: token
            },
            fetchPolicy: "network-only",
            onCompleted: (data) => {
                if (data?.getCurrentUser)
                    dispatch(setUser(
                        {
                            user_id: data?.getCurrentUser?.user_id,
                            name: data?.getCurrentUser?.name,
                            email: data?.getCurrentUser?.email,
                            password: data?.getCurrentUser?.password,
                        }));
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
                localStorage.removeItem("token");
                // navigate('/signin');
            }
        });
    if (loading) {
        return <Loader />;
    }
    if (error) {
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