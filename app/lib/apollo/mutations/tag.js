import {gql} from "@apollo/client";

export const DELETE_TAG = gql`
    mutation deleteTag($id: ID!) {
        deleteTag(id: $id)
    }
`

export const DELETE_TAGS = gql`
    mutation deleteCategories($ids: [ID!]!) {
        deleteTags(ids: $ids)
    }
`

export const CREATE_TAG = gql`
    mutation createTag($input: CreateTagInput!) {
        createTag(input: $input) {
            id
        }
    }
`

export const UPDATE_TAG = gql`
    mutation updateTag($patch: UpdateTagPatch!) {
        updateTag(patch: $patch)
    }
`