import { useLocation } from "react-router-dom";
import { TripChecklists } from "../../../ApolloClient/Queries/Trips";
import { useQuery } from "@apollo/client";

export const Checklists = () => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const member_id = location?.state?.member_id;
    const trip_id = location?.state?.trip_id;

    const { data: tripdata } = useQuery(TripChecklists, {
        variables: {
            input: {
                trip_id: trip_id,
                member_id: member_id
            }
        }
    });
    return (
        <main>
            <h4>Trip Checklists : </h4>
            <ol>{
                tripdata?.trip?.trip_checklists?.map((item: string, index: number) => (
                    <li key={index}>
                        {item}
                    </li>
                ))
            }</ol>
        </main>
    )
}