import { gql } from "@apollo/client";

export const JoinedTrips = gql`
    query($input: JoinedTripsInput!){
        joinedTrips(input: $input){
            trip_id
            trip_name
            trip_status
            created_by{
                member_id,
                user{
                    name,
                    email
                }
            }
        }
    }
`
export const TripData = gql`
    query($input: TripInput!){
        trip(input: $input){
            trip_id
            trip_name
            trip_description
            trip_status
            trip_days_count
            trip_start_date
            trip_budget
            created_at
            updated_at
            created_by{
                member_id,
                user{
                    name,
                    email
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
export const TripMembersData= gql`
 query($input: TripInput!){
        trip(input: $input){
            trip_members{
                trip_member_id
                group_member{
                    user{
                        name,
                        email
                    }
                }
            }
        }
    }
    `