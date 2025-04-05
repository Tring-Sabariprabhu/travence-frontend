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
                email,
                name
            }
        }
    }`

export const GroupData = gql`
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

export const GroupMemberDetails = gql`
    query($member_id: String!){
        groupMember(member_id: $member_id){
            user_role
        }
    }`