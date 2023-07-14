import {newGraphQLClient} from "~/lib/apollo";
import {GET_TAGS} from "~/lib/apollo/queries/shop";
import {CREATE_TAG, DELETE_TAGS, DELETE_TAG, UPDATE_TAG} from "~/lib/apollo/mutations/tag";

export async function getTags(domain) {
    try {
        return await newGraphQLClient(domain).query({
            query: GET_TAGS
        });
    } catch (e) {
        console.log(e.networkError.result)
    }
}

export async function updateTag(domain, patch) {
    return await newGraphQLClient(domain).mutate({
        mutation: UPDATE_TAG,
        variables: {
            patch
        },
        refetchQueries: [
            {query: GET_TAGS},
        ],
    });
}

export async function deleteTag(domain, id) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_TAG,
            variables: {
                id
            },
            refetchQueries: [
                {query: GET_TAGS},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}

export async function deleteTags(domain, ids) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_TAGS,
            variables: {
                ids
            },
            refetchQueries: [
                {query: GET_TAGS},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}

export async function createTag(domain, input) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: CREATE_TAG,
            variables: {
                input
            },
            refetchQueries: [
                {query: GET_TAGS},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}