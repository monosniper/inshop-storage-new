import {gql} from "@apollo/client";

export const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!) {
        deleteClient(id: $id)
    }
`

export const DELETE_CLIENTS = gql`
    mutation deleteClients($ids: [ID!]!) {
        deleteClients(ids: $ids)
    }
`

export const CREATE_CLIENT = gql`
    mutation createClient($input: CreateClientInput!) {
        createClient(input: $input) {
            id
        }
    }
`

export const UPDATE_CLIENT = gql`
    mutation updateClient($patch: UpdateClientPatch!) {
        updateClient(patch: $patch)
    }
`