import {gql} from "@apollo/client";

export const CREATE_SHOP = gql`
    mutation createShop($input: CreateShopInput!) {
        createShop(input: $input) {
            id
        }
    }
`

export const GET_SHOPS = gql`
    query Shops($userId: ID!) {
        shops(userId: $userId) {
            id
            uuid
            options
            Domain {
                id
                name
                isSubdomain
            }
            Tags {
                id
                uuid
                title
                color
                
                Media {
                    name
                    filename
                }
            }
            Modules {
                slug

                Shop_Module {
                    isActive
                }
            }
            Colors {
                slug

                Shop_Color {
                    value
                }
            }
            Filters {
                id
                slug
            }
            Media {
                name
                filename
            }
        }
    }
`

export const GET_DOMAINS = gql`
    query Domains(
            $userId: ID!
            $notUsed: Boolean
        ) {
        domains(
                userId: $userId
                notUsed: $notUsed
            ) {
            id
            name
            isSubdomain
        }
    }
`

export const GET_POSITIONS = gql`
    query Positions {
        positions {
            uuid
            id
            type
            price
            discount
            discount_type
            priority
            description
            title
            subtitle
            inStock
            properties
            
            Media {
                name
                filename
            }

            Category {
                id
                title
                uuid
            
                Media {
                    name
                    filename
                }
            }
            
            Tags {
                id
                uuid
                title
                color
                
                Media {
                    name
                    filename
                }
            }
        }
    }
`

export const GET_CATEGORIES = gql`
    query Categories {
        categories {
            id
            title
            uuid
            
            Media {
                name
                filename
            }
        }
    }
`

export const GET_TAGS = gql`
    query Tags {
        tags {
            id
            title
            color
            uuid
            
            Media {
                name
                filename
            }
        }
    }
`

export const GET_CLIENTS = gql`
    query Clients {
        clients {
            id
            age
            fio
            email
            address
            phone
            uuid
            
            Media {
                name
                filename
            }
        }
    }
`

export const GET_MODULES = gql`
    query Modules($buyed: Boolean!) {
        modules(buyed: $buyed) {
            id
            uuid
            title
            description
            price
            slug
            options
          
            buyed
            isActive
            
            Media {
                name
                filename
            }
            
            Dependencies {
                id
                
                Dependencies {
                    id
                }
            }
        }
    }
`

export const DELETE_SHOP = gql`
    mutation deleteShop($id: ID!) {
        deleteShop(id: $id)
    }
`

export const UPDATE_SHOP = gql`
    mutation updateShop($patch: UpdateShopPatch!) {
        updateShop(patch: $patch)
    }
`

export const SEARCH_SHOPS = gql`
    query Shops($query: String, $userId: ID, $limit: Int) {
        shops(query: $query, userId: $userId, limit: $limit) {
            uuid
            title
            
            Media {
                name
                filename
            }
        }
    }
`