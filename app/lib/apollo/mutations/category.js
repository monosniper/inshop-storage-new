import {gql} from "@apollo/client";

export const DELETE_CATEGORY = gql`
    mutation deleteCategory($id: ID!) {
        deleteCategory(id: $id)
    }
`

export const DELETE_CATEGORIES = gql`
    mutation deleteCategories($ids: [ID!]!) {
        deleteCategories(ids: $ids)
    }
`

export const CREATE_CATEGORY = gql`
    mutation createCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
            id
        }
    }
`

export const UPDATE_CATEGORY = gql`
    mutation updateCategory($patch: UpdateCategoryPatch!) {
        updateCategory(patch: $patch)
    }
`