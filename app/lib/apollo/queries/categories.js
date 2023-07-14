import {gql} from "@apollo/client";

export const SEARCH_CATEGORIES = gql`
    query Categories($query: String, $userId: ID, $limit: Int) {
        categories(query: $query, userId: $userId, limit: $limit) {
            id
            uuid
            title
            
            Media {
                name
                filename
            }
        }
    }
`