import { gql } from "@apollo/client";

export const CreateTrip = gql`
    mutation($input: CreateTripInput!){
        createTrip(input: $input)
    }
`