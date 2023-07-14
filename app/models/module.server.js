import {newGraphQLClient} from "~/lib/apollo";
import {GET_MODULES} from "~/lib/apollo/queries/shop";
import {ACTIVATE_MODULE, DEACTIVATE_MODULE, GET_MODULE, BUY_MODULE, SAVE_MODULE} from "~/lib/apollo/mutations/module";

export async function getModules(domain, buyed=false) {
    return await newGraphQLClient(domain).query({
        query: GET_MODULES,
        variables: {
            buyed
        }
    });
}

export async function getModule(domain, slug) {
    try {
        return await newGraphQLClient(domain).query({
            query: GET_MODULE,
            variables: {
                slug
            }
        });
    } catch (e) {
        // const err = JSON.parse(JSON.stringify(e))
        // console.log(err)
        console.log(JSON.parse(JSON.stringify(e.graphQLErrors[0].locations)))
        // err.networkError && console.error(err.networkError.result.errors)
    }
}

export async function activateModule(domain, id) {
    return await newGraphQLClient(domain).mutate({
        mutation: ACTIVATE_MODULE,
        variables: {
            id
        },
        refetchQueries: [
            {query: GET_MODULES},
        ],
    });
}

export async function deactivateModule(domain, id) {
    return await newGraphQLClient(domain).mutate({
        mutation: DEACTIVATE_MODULE,
        variables: {
            id
        },
        refetchQueries: [
            {query: GET_MODULES},
        ],
    });
}

export async function buyModule(domain, id) {
    return await newGraphQLClient(domain).mutate({
        mutation: BUY_MODULE,
        variables: {
            id
        },
        refetchQueries: [
            {query: GET_MODULES},
        ],
    });
}

export async function saveModule(domain, options, id) {
    try {
        return await newGraphQLClient(domain).mutate({
            mutation: SAVE_MODULE,
            variables: {
                input: {
                    id,
                    options
                }
            },
            refetchQueries: [
                {query: GET_MODULES},
            ],
        });
    } catch (e) {
        const err = JSON.parse(JSON.stringify(e))
        console.log(err)
        err.networkError && console.error(err.networkError.result.errors)
    }
}