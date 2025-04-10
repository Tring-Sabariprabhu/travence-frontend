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
export const FullTripDetails = gql`
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
export const Trip_Details = gql`
   query($input: TripInput!){
        trip(input: $input){
            trip_id, trip_name,
            trip_description,
            trip_start_date,
            trip_days_count,
            trip_status
            trip_budget
            created_by{
                member_id
            }
        }
    }
`
export const TripActivities = gql`
    query($input: TripInput!){
        trip(input: $input){
            trip_activities{
                activity
                budget
            }
        }
    }
`
export const TripChecklists = gql`
    query($input: TripInput!){
        trip(input: $input){
            trip_checklists
        }
    }
`



export const TripMembersDetails= gql`
 query($input: TripInput!){
        trip(input: $input){
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
        }
    }
`
export const TripMemberDetails = gql`
    query($input: TripMemberInput!){
        tripMember(input: $input){
            trip_member_id
            group_member{
                member_id
            }
        }
    }
`

export const ExpenseDetails = gql`
    query($input: TripInput!){
        trip(input: $input){
            expense_remainders{
                amount
                toPay{
                    trip_member_id
                    group_member{
                        member_id
                        user{
                            user_id
                            name
                        }
                    }
                }
                paidBy{
                    trip_member_id
                    group_member{
                        member_id
                        user{
                            user_id
                            name
                        }
                    }
                }
            }
        }
    }
`
export const GroupMembersForTrip = gql`
    query($input: GroupMembersForTripInput!){
        groupMembersForTrip(input: $input){
            member_id,
            name
        }
    }
`
