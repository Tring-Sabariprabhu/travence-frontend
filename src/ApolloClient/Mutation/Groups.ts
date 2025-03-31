import { gql } from "@apollo/client";

export const CreateGroup = gql`
    mutation create($input: CreateGroupInput!){
        createGroup(input: $input)
    }`

export const UpdateGroup = gql`
    mutation update($input: UpdateGroupInput!){
        updateGroup(input: $input)
    }`

export const DeleteGroup = gql`
mutation delete($group_id: String!){
    deleteGroup(group_id: $group_id)
}`

// export const AddUserToGroup = gql`
// mutation insert($group_id: String!, $user_id: String!, $role: String){
//     addUserToGroup(group_id: $group_id, user_id: $user_id, role: $role)
// }`
export const ChangeRoleInGroup = gql`
mutation change($input: ChangeRoleInput!){
    changeRole(input: $input)
}`
export const DeleteUserFromGroup = gql`
mutation delete($input: DeleteGroupMemberInput!){
    deleteGroupMember(input: $input)
}`