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
  rounds: Scalars['Int'];
  status: GameStatus;
  teams: Array<Team>;
};

export enum GameStatus {
  Finished = 'FINISHED',
  Lobby = 'LOBBY',
  WaitingForAnswers = 'WAITING_FOR_ANSWERS',
  WaitingForQuestion = 'WAITING_FOR_QUESTION'
}

export type Mutation = {
  __typename?: 'Mutation';
  createGame: MutationCreateGameResult;
  joinToGame: Player;
  sendAnswer: Scalars['Float'];
  startGame: Game;
};


export type MutationCreateGameArgs = {
  gameInput: CreateGameInput;
};


export type MutationJoinToGameArgs = {
  playerName: Scalars['String'];
  teamId: Scalars['ID'];
};


export type MutationStartGameArgs = {
  gameId: Scalars['ID'];
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
  team: Team;
};

export type Query = {
  __typename?: 'Query';
  me: Player;
  test: TeamColor;
};


export type QueryTestArgs = {
  asd: TeamColor;
};

export type Subscription = {
  __typename?: 'Subscription';
  gameState: Game;
  players: Array<Player>;
};


export type SubscriptionGameStateArgs = {
  gameId: Scalars['String'];
};


export type SubscriptionPlayersArgs = {
  gameId: Scalars['String'];
};

export type Team = {
  __typename?: 'Team';
  color: Scalars['String'];
  id: Scalars['ID'];
  players: Array<Player>;
};

export enum TeamColor {
  Blue = 'BLUE',
  Red = 'RED'
}

export type CreateGameMutationVariables = Exact<{
  input: CreateGameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'AlreadyExistError', message: string } | { __typename?: 'BaseError' } | { __typename?: 'MutationCreateGameSuccess', data: { __typename?: 'Game', id: string, status: GameStatus } } };

export type JoinToGameMutationVariables = Exact<{
  teamId: Scalars['ID'];
  name: Scalars['String'];
}>;


export type JoinToGameMutation = { __typename?: 'Mutation', joinToGame: { __typename?: 'Player', id: string, name: string, team: { __typename?: 'Team', id: string, color: string } } };

export type AsdQueryVariables = Exact<{ [key: string]: never; }>;


export type AsdQuery = { __typename?: 'Query', test: TeamColor };

export type GameSubscriptionVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type GameSubscription = { __typename?: 'Subscription', gameState: { __typename?: 'Game', id: string, status: GameStatus, teams: Array<{ __typename?: 'Team', id: string, color: string }> } };

export type PlayersSubscriptionVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type PlayersSubscription = { __typename?: 'Subscription', players: Array<{ __typename?: 'Player', id: string, name: string, team: { __typename?: 'Team', id: string, color: string } }> };


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
export const JoinToGameDocument = gql`
    mutation JoinToGame($teamId: ID!, $name: String!) {
  joinToGame(teamId: $teamId, playerName: $name) {
    id
    name
    team {
      id
      color
    }
  }
}
    `;
export type JoinToGameMutationFn = Apollo.MutationFunction<JoinToGameMutation, JoinToGameMutationVariables>;

/**
 * __useJoinToGameMutation__
 *
 * To run a mutation, you first call `useJoinToGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinToGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinToGameMutation, { data, loading, error }] = useJoinToGameMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useJoinToGameMutation(baseOptions?: Apollo.MutationHookOptions<JoinToGameMutation, JoinToGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinToGameMutation, JoinToGameMutationVariables>(JoinToGameDocument, options);
      }
export type JoinToGameMutationHookResult = ReturnType<typeof useJoinToGameMutation>;
export type JoinToGameMutationResult = Apollo.MutationResult<JoinToGameMutation>;
export type JoinToGameMutationOptions = Apollo.BaseMutationOptions<JoinToGameMutation, JoinToGameMutationVariables>;
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
export const GameDocument = gql`
    subscription Game($gameId: String!) {
  gameState(gameId: $gameId) {
    id
    status
    teams {
      id
      color
    }
  }
}
    `;

/**
 * __useGameSubscription__
 *
 * To run a query within a React component, call `useGameSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGameSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameSubscription({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameSubscription(baseOptions: Apollo.SubscriptionHookOptions<GameSubscription, GameSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GameSubscription, GameSubscriptionVariables>(GameDocument, options);
      }
export type GameSubscriptionHookResult = ReturnType<typeof useGameSubscription>;
export type GameSubscriptionResult = Apollo.SubscriptionResult<GameSubscription>;
export const PlayersDocument = gql`
    subscription Players($gameId: String!) {
  players(gameId: $gameId) {
    id
    name
    team {
      id
      color
    }
  }
}
    `;

/**
 * __usePlayersSubscription__
 *
 * To run a query within a React component, call `usePlayersSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePlayersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayersSubscription({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function usePlayersSubscription(baseOptions: Apollo.SubscriptionHookOptions<PlayersSubscription, PlayersSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PlayersSubscription, PlayersSubscriptionVariables>(PlayersDocument, options);
      }
export type PlayersSubscriptionHookResult = ReturnType<typeof usePlayersSubscription>;
export type PlayersSubscriptionResult = Apollo.SubscriptionResult<PlayersSubscription>;