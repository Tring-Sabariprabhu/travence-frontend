import { gql } from "@apollo/client";

export const JoinedTrips = gql`
    query($input: JoinedTripsInput!){
        joinedTrips(input: $input){
            trip_id
            trip_name
            trip_description
            trip_status
            trip_days_count
            trip_start_date
            created_by{
                member_id,
                user{
                    name,
                    email
                }
            }
            trip_members{
                trip_member_id
                group_member{
                    member_id
                    user{
                        name,
                        email
                    }
                }
            }
            trip_checklists
            trip_activities{
                activity
                budget
            }
        }
    }
`