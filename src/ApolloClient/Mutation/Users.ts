import { gql } from "@apollo/client";


export const UpdateUserDetails = gql`
    mutation update($input: UpdateUserInput!){
        updateUser(input: $input)
    }
    `