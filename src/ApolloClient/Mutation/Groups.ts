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
mutation delete($input: DeleteGroupInput!){
    deleteGroup(input: $input)
}`

export const ChangeRoleInGroup = gql`
mutation change($input: GroupMemberActionsInput!){
    changeRole(input: $input)
}`
export const DeleteUserFromGroup = gql`
mutation delete($input: GroupMemberActionsInput!){
    deleteGroupMember(input: $input)
}`