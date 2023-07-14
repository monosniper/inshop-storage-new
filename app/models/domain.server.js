import {newGraphQLClient} from "~/lib/apollo";
import {GET_DOMAINS} from "~/lib/apollo/queries/shop";
import {CREATE_DOMAIN, DELETE_DOMAIN, DELETE_DOMAINS} from "~/lib/apollo/mutations/domain";

export async function deleteDomain(domain, id) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_DOMAIN,
            variables: {
                id
            },
            refetchQueries: [
                {query: GET_DOMAINS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}

export async function deleteDomains(domain, ids) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: DELETE_DOMAINS,
            variables: {
                ids
            },
            refetchQueries: [
                {query: GET_DOMAINS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}

export async function createDomain(domain, input) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: CREATE_DOMAIN,
            variables: {
                input
            },
            refetchQueries: [
                {query: GET_DOMAINS},
            ],
        });
    } catch (err) {
        console.log(JSON.parse(JSON.stringify(err)))
        err.networkError && console.error(err.networkError.result.errors)
        err.graphQLErrors && console.error(err.graphQLErrors)
    }

    return null
}