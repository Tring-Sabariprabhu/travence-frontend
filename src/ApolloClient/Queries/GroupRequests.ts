import { gql } from "@apollo/client";

export const GetInvitedlist = gql`
    query get($admin_id: String!){
        getGroupInvitedList(admin_id: $admin_id){
            request_id
            email
            user_registered
            requested_by
            requested_at
            status
            }
    }
`

export const GetGroupJoinRequests = gql`
    query getGroupRequests($email: String!){
        getGroupJoinRequests(email: $email){
            request_id,
            requested_at,
            group_name,
            admin_name,
        }
    }`