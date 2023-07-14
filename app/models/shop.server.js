import {newGraphQLClient} from "~/lib/apollo";
import {CREATE_SHOP, SEARCH_SHOPS, GET_SHOPS, DELETE_SHOP, UPDATE_SHOP, GET_DOMAINS} from "~/lib/apollo/queries/shop";
import {SEARCH_POSITIONS} from "~/lib/apollo/queries/positions";
import {SEARCH_MODULES} from "~/lib/apollo/queries/modules";
import {SEARCH_CATEGORIES} from "~/lib/apollo/queries/categories";

export async function createShop(domain, input) {
  try {
    return await newGraphQLClient(domain).mutate({
      mutation: CREATE_SHOP,
      variables: {
        input
      },
      refetchQueries: [
        {query: GET_SHOPS},
      ],
    });
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)))

    console.log(JSON.parse(JSON.stringify(e.networkError.result)))
  }

  return null
}

export async function updateShop(domain, patch) {
  try {
    return await newGraphQLClient(domain).mutate({
      mutation: UPDATE_SHOP,
      variables: {
        patch
      },
      refetchQueries: [
        {query: GET_SHOPS},
      ],
    });
  } catch (e) {
    const err = JSON.parse(JSON.stringify(e))
    console.log(err)
    err.networkError && console.error(err.networkError.result.errors)
  }

  return null
}

export async function deleteShop(domain, id) {
  try {
    return await newGraphQLClient(domain).mutate({
      mutation: DELETE_SHOP,
      variables: {
        id
      },
      refetchQueries: [
        {query: GET_SHOPS},
      ],
    });
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)))
  }

  return null
}

export async function getShops(domain, userId) {
  try {
    return await newGraphQLClient(domain).query({
      query: GET_SHOPS,
      variables: {
        userId
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    console.log(e.graphQLErrors)
    return null
  }
}

export async function getDomains(domain, userId, notUsed) {
  try {
    return await newGraphQLClient(domain).query({
      query: GET_DOMAINS,
      variables: {
        userId,
        notUsed
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}

export async function searchPositions(domain, query, limit) {
  try {
    return await newGraphQLClient(domain).query({
      query: SEARCH_POSITIONS,
      variables: {
        query,
        limit,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}

export async function searchModules(domain, query, limit) {
  try {
    return await newGraphQLClient(domain).query({
      query: SEARCH_MODULES,
      variables: {
        query,
        limit,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}


export async function searchCategories(domain, query, limit, userId) {
  try {
    return await newGraphQLClient(domain).query({
      query: SEARCH_CATEGORIES,
      variables: {
        query,
        limit,
        userId,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}


export async function searchShops(domain, query, limit, userId) {
  try {
    return await newGraphQLClient(domain).query({
      query: SEARCH_SHOPS,
      variables: {
        query,
        limit,
        userId,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}