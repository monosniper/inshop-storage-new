import {gql} from "@apollo/client";

export const SEARCH_MODULES = gql`
    query Modules($query: String, $limit: Int) {
        modules(query: $query, limit: $limit) {
            slug
            uuid
            title
            
            Media {
                name
                filename
            }
        }
    }
`