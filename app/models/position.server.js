import {newGraphQLClient} from "~/lib/apollo";
import {GET_POSITIONS} from "~/lib/apollo/queries/shop";
import {CREATE_POSITION, DELETE_POSITION, DELETE_POSITIONS, UPDATE_POSITION} from "~/lib/apollo/mutations/position";

export async function getPositions(domain) {
  return await newGraphQLClient(domain).query({
    query: GET_POSITIONS
  });
}

export async function updatePosition(domain, patch) {
  return await newGraphQLClient(domain).mutate({
    mutation: UPDATE_POSITION,
    variables: {
      patch
    },
    refetchQueries: [
      {query: GET_POSITIONS},
    ],
  });

  return null
}

export async function deletePosition(domain, id) {
  try {
    return await newGraphQLClient(domain).mutate({
      mutation: DELETE_POSITION,
      variables: {
        id
      },
      refetchQueries: [
        {query: GET_POSITIONS},
      ],
    });
  } catch (e) {
    console.log(e)
  }

  return null
}

export async function deletePositions(domain, ids) {
  try {
    return await newGraphQLClient(domain).mutate({
      mutation: DELETE_POSITIONS,
      variables: {
        ids
      },
      refetchQueries: [
        {query: GET_POSITIONS},
      ],
    });
  } catch (e) {
    console.log(e)
  }

  return null
}

export async function createPosition(domain, input) {
  try {
    return await newGraphQLClient(domain).mutate({
      mutation: CREATE_POSITION,
      variables: {
        input
      },
      refetchQueries: [
        {query: GET_POSITIONS},
      ],
    });
  } catch (e) {
    console.log(e)
  }

  return null
}