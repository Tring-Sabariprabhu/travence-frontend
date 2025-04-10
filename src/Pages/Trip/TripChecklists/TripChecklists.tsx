import { useLocation } from "react-router-dom";
import { TripChecklists } from "../../../ApolloClient/Queries/Trips";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

export const Checklists = () => {
    const user = useSelector((state: RootState)=> state?.user);
    const { data: tripdata } = useQuery(TripChecklists, {
        variables: {
            input: {
                trip_id: user?.trip_id,
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