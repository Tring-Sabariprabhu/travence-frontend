import { gql } from "@apollo/client";

export const CreateGroup = gql`
    mutation create($created_by: String!, $name: String!, $description: String){
        createGroup(created_by: $created_by, name: $name, description: $description)
    }`

export const UpdateGroup = gql`
    mutation update($group_id: String!, $name: String!, $description: String){
        updateGroup(group_id: $group_id, name: $name, description: $description)
    }`
export const DeleteGroup = gql`
mutation delete($group_id: String!){
    deleteGroup(group_id: $group_id)
}`

export const AddUserToGroup = gql`
mutation insert($group_id: String!, $user_id: String!, $role: String){
    addUserToGroup(group_id: $group_id, user_id: $user_id, role: $role)
}`

export const DeleteUserFromGroup = gql`
mutation delete($admin_id: String!, $member_id: String!){
    deleteUserFromGroup(admin_id: $admin_id, member_id: $member_id)
}`
export const ChangeRoleInGroup = gql`
mutation change($admin_id: String!, $member_id: String!){
    changeRoleInGroup(admin_id: $admin_id, member_id: $member_id)
}`