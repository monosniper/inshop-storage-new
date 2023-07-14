import {newGraphQLClient} from "~/lib/apollo";
import {GET_CLIENTS} from "~/lib/apollo/queries/shop";
import {CREATE_CLIENT, DELETE_CLIENT, DELETE_CLIENTS, UPDATE_CLIENT} from "~/lib/apollo/mutations/client";

export async function getClients(domain) {
    return await newGraphQLClient(domain).query({
        query: GET_CLIENTS
    });
}

export async function updateClient(domain, patch) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: UPDATE_CLIENT,
            variables: {
                patch
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        const err = JSON.parse(JSON.stringify(e))
        console.log(err)
        err.networkError && console.error(err.networkError.result.errors)
    }

    return null
}

export async function deleteClient(domain, id) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_CLIENT,
            variables: {
                id
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}

export async function deleteClients(domain, ids) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_CLIENTS,
            variables: {
                ids
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}

export async function createClient(domain, input) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: CREATE_CLIENT,
            variables: {
                input
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}