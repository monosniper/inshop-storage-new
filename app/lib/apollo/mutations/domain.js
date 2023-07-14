import {gql} from "@apollo/client";

export const DELETE_DOMAIN = gql`
    mutation deleteDomain($id: ID!) {
        deleteDomain(id: $id)
    }
`

export const DELETE_DOMAINS = gql`
    mutation deleteDomains($ids: [ID!]!) {
        deleteDomains(ids: $ids)
    }
`

export const CREATE_DOMAIN = gql`
    mutation createDomain($input: CreateDomainInput!) {
        createDomain(input: $input) {
            id
        }
    }
`