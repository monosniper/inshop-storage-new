import {gql} from "@apollo/client";

export const GET_REVIEWS = gql`
    query Reviews($shopId: ID) {
        reviews(shopId: $shopId) {
            author_url
            author_name
            rating
            date
            content
        }
    }
`