import { Outlet } from "react-router-dom";
import { SideBar } from "../../Components/SideBar/SideBar";
import './Dashboard.scss'
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import { setUser } from "../../Redux/userSlice";
import { GetCurrentUser } from "../../ApolloClient/Queries/Users";
import { Loader } from "../../Components/Loader/Loader";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";

const DashboardLayout = () => {

    const dispatch = useDispatch();
    const { loading, error } = useQuery(GetCurrentUser,
        {
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
        });
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage/>;
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