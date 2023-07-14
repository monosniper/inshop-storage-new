import {gql} from "@apollo/client";

export const DELETE_POSITION = gql`
    mutation deletePosition($id: ID!) {
        deletePosition(id: $id)
    }
`

export const DELETE_POSITIONS = gql`
    mutation deletePositions($ids: [ID!]!) {
        deletePositions(ids: $ids)
    }
`

export const CREATE_POSITION = gql`
    mutation createPosition($input: CreatePositionInput!) {
        createPosition(input: $input) {
            id
        }
    }
`

export const UPDATE_POSITION = gql`
    mutation updatePosition($patch: UpdatePositionPatch!) {
        updatePosition(patch: $patch)
    }
`