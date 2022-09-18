/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AlreadyExistError = Error & {
  __typename?: 'AlreadyExistError';
  message: Scalars['String'];
};

export type BaseError = Error & {
  __typename?: 'BaseError';
  message: Scalars['String'];
};

export type CreateGameInput = {
  gameId: Scalars['String'];
  playerName: Scalars['String'];
  playerTeam: TeamColor;
};

export type Error = {
  message: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  id: Scalars['ID'];
  status: Scalars['String'];
};

export type JoinToGameInput = {
  gameId: Scalars['ID'];
  playerName: Scalars['String'];
  playerTeam: TeamColor;
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: MutationCreateGameResult;
  joinToGame: Scalars['Boolean'];
  sendAnswer: Scalars['Float'];
};


export type MutationCreateGameArgs = {
  gameInput: CreateGameInput;
};


export type MutationJoinToGameArgs = {
  gameInput: CreateGameInput;
};

export type MutationCreateGameResult = AlreadyExistError | BaseError | MutationCreateGameSuccess;

export type MutationCreateGameSuccess = {
  __typename?: 'MutationCreateGameSuccess';
  data: Game;
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  test: TeamColor;
};


export type QueryTestArgs = {
  asd: TeamColor;
};

export type Subscription = {
  __typename?: 'Subscription';
  players: Array<Player>;
};


export type SubscriptionPlayersArgs = {
  gameId: Scalars['String'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  player: Array<Player>;
  teamColor: Scalars['String'];
};

export enum TeamColor {
  Blue = 'BLUE',
  Red = 'RED'
}

export type CreateGameMutationVariables = Exact<{
  input: CreateGameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'AlreadyExistError', message: string } | { __typename?: 'BaseError' } | { __typename?: 'MutationCreateGameSuccess', data: { __typename?: 'Game', id: string, status: string } } };

export type AsdQueryVariables = Exact<{ [key: string]: never; }>;


export type AsdQuery = { __typename?: 'Query', test: TeamColor };


export const CreateGameDocument = gql`
    mutation createGame($input: CreateGameInput!) {
  createGame(gameInput: $input) {
    ... on MutationCreateGameSuccess {
      data {
        id
        status
      }
    }
    ... on AlreadyExistError {
      message
    }
  }
}
    `;
export type CreateGameMutationFn = Apollo.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: Apollo.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, options);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = Apollo.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = Apollo.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;
export const AsdDocument = gql`
    query asd {
  test(asd: BLUE)
}
    `;

/**
 * __useAsdQuery__
 *
 * To run a query within a React component, call `useAsdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAsdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAsdQuery({
 *   variables: {
 *   },
 * });
 */
export function useAsdQuery(baseOptions?: Apollo.QueryHookOptions<AsdQuery, AsdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AsdQuery, AsdQueryVariables>(AsdDocument, options);
      }
export function useAsdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AsdQuery, AsdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AsdQuery, AsdQueryVariables>(AsdDocument, options);
        }
export type AsdQueryHookResult = ReturnType<typeof useAsdQuery>;
export type AsdLazyQueryHookResult = ReturnType<typeof useAsdLazyQuery>;
export type AsdQueryResult = Apollo.QueryResult<AsdQuery, AsdQueryVariables>;