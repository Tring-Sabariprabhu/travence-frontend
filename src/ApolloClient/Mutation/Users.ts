import { gql } from "@apollo/client";


export const UpdateUserDetails = gql`
    mutation update($user_id: String!, $name: String!, $password: String!, $image: String){
        updateUser(user_id: $user_id, name: $name, password: $password, image: $image)
    }
    `