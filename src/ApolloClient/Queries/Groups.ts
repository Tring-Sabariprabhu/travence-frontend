import { gql } from "@apollo/client";

export const GroupsList = gql`
    query($user_id: String!){
        groupList(user_id: $user_id){
            group_id,
            name,
            description,
            created_user_email,
            created_by,
            created_at,
            updated_at
        }
    }`

export const GroupData = gql`
    query ($group_id: String!){
        group(group_id: $group_id){
            group_id,
            name,
            description,
            created_user_email,
            created_by,
            created_at,
            updated_at,
            group_members{
                member_id,
                user_id,
                group_id,
                role,
                joined_at,
                profile{
                    name,
                    email
                }
            }
        }
    }`