import { gql } from "@apollo/client";

export const GetInvitedList = gql`
    query get($input: GetInvitedListInput!){
        getGroupInvitedList(input: $input){
            invite_id,
            email,
            registered_user,
            invite_status,
            invited_at,
        }
    }
`

export const GetGroupInvites = gql`
    query get($input: GetGroupInvitesInput!){
        getGroupInvites(input: $input){
            invite_id,
            email,
            registered_user,
            invite_status,
            invited_at,
            invited_by{
              member_id
              group{
                group_name,
                group_description
              }
              user{
                name,
                email
              }
            }
        }
    }`