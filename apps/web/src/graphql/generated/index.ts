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

export type Alternative = {
  __typename?: 'Alternative';
  id: Scalars['ID'];
  text: Scalars['String'];
};

export type Answer = {
  __typename?: 'Answer';
  alternatives: Array<Alternative>;
  id: Scalars['ID'];
  label: Scalars['String'];
  order: Scalars['Int'];
  points: Scalars['Int'];
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
  status: GameStatus;
  teams: Array<Team>;
};

export type GameOptions = {
  __typename?: 'GameOptions';
  id: Scalars['ID'];
  language: Language;
  rounds: Scalars['Int'];
};

export enum GameStatus {
  Finished = 'FINISHED',
  Lobby = 'LOBBY',
  WaitingForAnswers = 'WAITING_FOR_ANSWERS',
  WaitingForQuestion = 'WAITING_FOR_QUESTION'
}

export enum Language {
  En = 'EN',
  Pl = 'PL'
}

export type Mutation = {
  __typename?: 'Mutation';
  createGame: MutationCreateGameResult;
  joinToGame: Player;
  sendAnswer: Scalars['Float'];
  startGame: Game;
  yieldQuestion: Question;
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


export type MutationYieldQuestionArgs = {
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
  test: TeamColor;
};


export type QueryTestArgs = {
  asd: TeamColor;
};

export type Question = {
  __typename?: 'Question';
  answers: Array<Answer>;
  id: Scalars['ID'];
  status: Language;
  text: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  gameInfo: Game;
};


export type SubscriptionGameInfoArgs = {
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

export type StartGameMutationVariables = Exact<{
  gameId: Scalars['ID'];
}>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'Game', id: string, status: GameStatus } };

export type GameSubscriptionVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type GameSubscription = { __typename?: 'Subscription', gameInfo: { __typename?: 'Game', id: string, status: GameStatus, teams: Array<{ __typename?: 'Team', id: string, color: string, players: Array<{ __typename?: 'Player', id: string, name: string }> }> } };


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
export const StartGameDocument = gql`
    mutation StartGame($gameId: ID!) {
  startGame(gameId: $gameId) {
    id
    status
  }
}
    `;
export type StartGameMutationFn = Apollo.MutationFunction<StartGameMutation, StartGameMutationVariables>;

/**
 * __useStartGameMutation__
 *
 * To run a mutation, you first call `useStartGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGameMutation, { data, loading, error }] = useStartGameMutation({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useStartGameMutation(baseOptions?: Apollo.MutationHookOptions<StartGameMutation, StartGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument, options);
      }
export type StartGameMutationHookResult = ReturnType<typeof useStartGameMutation>;
export type StartGameMutationResult = Apollo.MutationResult<StartGameMutation>;
export type StartGameMutationOptions = Apollo.BaseMutationOptions<StartGameMutation, StartGameMutationVariables>;
export const GameDocument = gql`
    subscription Game($gameId: String!) {
  gameInfo(gameId: $gameId) {
    id
    status
    teams {
      id
      color
      players {
        id
        name
      }
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