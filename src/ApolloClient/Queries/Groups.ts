import { gql } from "@apollo/client";

export const GroupsList = gql`
    query($input: GroupListInput!){
        groupList(input: $input){
            group_id,
            group_name,
            group_description,
            created_at,
            updated_at,
            created_by{
                user_id,
                email,
                name
            }
        }
    }`
export const GroupDetails = gql`
    query ($input: GroupInput!){
        group(input: $input){
            group_id,
            group_name,
            group_description,
        }     
    }
`
export const FullGroupDetails = gql`
    query ($input: GroupInput!){
        group(input: $input){
            group_id,
            group_name,
            group_description,
            created_at,
            updated_at,
            created_by{
                email,
                name,
                user_id
            }
            group_members{
                member_id,
                user_role,
                joined_at,
                deleted_at,
                updated_at,
                user{
                    name,
                    email,
                    user_id
                }
            }
        }
    }`
export const GroupMembersDetails = gql`
    query ($input: GroupInput!){
        group(input: $input){
            group_members{
                member_id,
                user_role,
                joined_at,
                deleted_at,
                updated_at,
                user{
                    name,
                    email,
                    user_id
                }
            }
        }
    }
    `
export const GroupMemberDetails = gql`
    query($input: GroupMemberInput!){
        groupMember(input: $input){
            member_id
            user_role
        }
    }`