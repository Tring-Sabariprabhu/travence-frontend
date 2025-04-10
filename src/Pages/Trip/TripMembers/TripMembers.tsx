import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import {  TripMembersDetails } from "../../../ApolloClient/Queries/Trips";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { Loader } from "../../../Components/Loader/Loader";
import { TripMemberProps } from "../Main/Trip";
import { DataNotFound } from "../../../Components/DataNotFound/DataNotFound";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

export const TripMembers = () => {
    const user = useSelector((state: RootState)=> state?.user);
    const { data: tripdata, loading, error } = useQuery(TripMembersDetails,
        {
            variables: {
                input: {
                    trip_id: user?.trip_id
                }
            },
            skip: !user?.trip_id
        });
    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    const trip_members = tripdata?.trip?.trip_members;
    return (
        trip_members?.length > 0 ?
            <main className="group-members-container">
                <h4>Trip Members</h4>
                <div className="group-members-list">
                    {trip_members?.map((member: TripMemberProps) => (
                        <div className="member"key={member?.trip_member_id}>
                            <p className="name">{member?.group_member?.user?.name}</p>
                        </div>
                    ))}
                    
                </div>
            </main> : <DataNotFound />
    );
}