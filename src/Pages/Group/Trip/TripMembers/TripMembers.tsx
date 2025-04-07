import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { TripMembersData } from "../../../../ApolloClient/Queries/Trips";
import { ErrorPage } from "../../../../Components/ErrorPage/ErrorPage";
import { Loader } from "../../../../Components/Loader/Loader";
import { TripMemberProps } from "../Main/Trip";
import { DataNotFound } from "../../../../Components/DataNotFound/DataNotFound";

export const TripMembers = () => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const trip_id = location?.state?.trip_id;
    const member_id = location?.state?.member_id;

    const { data: tripdata, loading, error } = useQuery(TripMembersData,
        {
            variables: {
                input: {
                    member_id: member_id,
                    trip_id: trip_id
                }
            }
        });
    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    const trip_members = tripdata?.trip?.trip_members;
    return (
            trip_members?.length > 0 ?
                <div className="group-members-container">
                    <h4>Trip Members</h4>
                    <div className="group-members-list">
                    {trip_members?.map((member: TripMemberProps, index: number) => (
                        <div className="member">
                            <h4 className="name">{member?.group_member?.user?.name}</h4>
                        </div>
                    ))}
                        
                    </div>
                </div> : <DataNotFound message={"Trip Members"}/>
    );
}