import { gql } from "@apollo/client";

export const CreateTrip = gql`
    mutation($input: CreateTripInput!){
        createTrip(input: $input)
    }
`
export const UpdateTrip = gql`
    mutation($input: UpdateTripInput!){
        updateTrip(input: $input)
    }`

export const DeleteTrip = gql`
    mutation($input: DeleteTripInput!){
        deleteTrip(input: $input)
    }`

export const DeleteTripMember = gql`
    mutation($input: DeleteTripMemberInput!){
        deleteTripMember(input: $input)
    }`

