import {gql} from "@apollo/client";

export const ACTIVATE_MODULE = gql`
    mutation activateModule($id: ID!) {
        activateModule(id: $id)
    }
`

export const DEACTIVATE_MODULE = gql`
    mutation deactivateModule($id: ID!) {
        deactivateModule(id: $id)
    }
`

export const BUY_MODULE = gql`
    mutation buyModule($id: ID!) {
        buyModule(id: $id)
    }
`

export const SAVE_MODULE = gql`
    mutation saveModule($input: SaveModuleInput!) {
        saveModule(input: $input)
    }
`

export const GET_MODULE = gql`
    query Module($slug: String!) {
        module(slug: $slug) {
            id
            uuid
            title
            description
            price
            slug
            default_options
            options
            
            buyed
            isActive
            
            Media {
                name
                filename
            }
            
            Dependencies {
                id
                uuid
                title
                description
                price
                slug
                
                buyed
                
                Media {
                    name
                    filename
                }
                
                Dependencies {
                    id
                }
            }
        }
    }
`