import {newGraphQLClient} from "~/lib/apollo";
import {GET_CATEGORIES} from "~/lib/apollo/queries/shop";
import {CREATE_CATEGORY, DELETE_CATEGORIES, DELETE_CATEGORY, UPDATE_CATEGORY} from "~/lib/apollo/mutations/category";

export async function getCategories(domain) {
    return await newGraphQLClient(domain).query({
        query: GET_CATEGORIES
    });
}

export async function updateCategory(domain, patch) {
    return await newGraphQLClient(domain).mutate({
        mutation: UPDATE_CATEGORY,
        variables: {
            patch
        },
        refetchQueries: [
            {query: GET_CATEGORIES},
        ],
    });
}

export async function deleteCategory(domain, id) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_CATEGORY,
            variables: {
                id
            },
            refetchQueries: [
                {query: GET_CATEGORIES},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}

export async function deleteCategories(domain, ids) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_CATEGORIES,
            variables: {
                ids
            },
            refetchQueries: [
                {query: GET_CATEGORIES},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}

export async function createCategory(domain, input) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: CREATE_CATEGORY,
            variables: {
                input
            },
            refetchQueries: [
                {query: GET_CATEGORIES},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}