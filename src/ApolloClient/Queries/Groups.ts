import { gql } from "@apollo/client";

export const GroupsList = gql`
    query get{
        groupList{
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
    }
`
export const Group_Details = gql`
    query get($input: GroupInput!){
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
        }     
    }
`

export const GroupMembersDetails = gql`
    query get($input: GroupInput!){
        groupMembers(input: $input){
            
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
`
export const GroupMemberDetails = gql`
    query get($input: GroupMemberInput!){
        groupMember(input: $input){
            member_id
            user_role
            joined_at
            user{
                name
            }
        }
    }
`
