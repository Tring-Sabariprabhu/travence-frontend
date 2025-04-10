import { gql } from "@apollo/client";

export const GetInvitedList_Count = gql`
  query get($admin_id: String!){
    getGroupInvitedListCount(admin_id: $admin_id)
  }`
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
export const GetGroupInvite = gql`
  query get($input: GroupInviteInput!){
    getGroupInvite(input: $input){
            invite_id,
            email,
            registered_user,
            invite_status,
            invited_at,
    }
  }`
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