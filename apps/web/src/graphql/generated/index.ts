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
  id: Scalars['ID'];
  label: Scalars['String'];
  order: Scalars['Int'];
  points: Scalars['Int'];
};

export type AnsweringPlayer = {
  __typename?: 'AnsweringPlayer';
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
};

export type BaseError = Error & {
  __typename?: 'BaseError';
  message: Scalars['String'];
};

export type Board = {
  __typename?: 'Board';
  answersNumber: Scalars['Int'];
  discoveredAnswers: Array<GameAnswer>;
  teams: Array<GameTeam>;
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

export type GameAnswer = {
  __typename?: 'GameAnswer';
  id: Scalars['ID'];
  label: Scalars['String'];
  order: Scalars['Int'];
  points: Scalars['Int'];
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

export type GameTeam = {
  __typename?: 'GameTeam';
  color: TeamColor;
  failures: Scalars['Int'];
  points: Scalars['Int'];
};

export enum Language {
  En = 'EN',
  Pl = 'PL'
}

export type Mutation = {
  __typename?: 'Mutation';
  createGame: MutationCreateGameResult;
  joinToGame: Player;
  sendAnswer: Scalars['Boolean'];
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


export type MutationSendAnswerArgs = {
  answer: Scalars['String'];
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
  id: Scalars['ID'];
  language: Language;
  text: Scalars['String'];
};

export type Round = {
  __typename?: 'Round';
  board: Board;
  stage: Stage;
  status: GameStatus;
};

export type Stage = {
  __typename?: 'Stage';
  answeringPlayers: Array<AnsweringPlayer>;
  question: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  gameInfo: Game;
  state: Round;
};


export type SubscriptionGameInfoArgs = {
  gameId: Scalars['String'];
};


export type SubscriptionStateArgs = {
  gameId: Scalars['ID'];
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


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'AlreadyExistError', message: string } | { __typename?: 'BaseError' } | { __typename?: 'MutationCreateGameSuccess', data: { __typename?: 'Game', id: string, teams: Array<{ __typename?: 'Team', players: Array<{ __typename?: 'Player', id: string, name: string, team: { __typename?: 'Team', id: string, color: string } }> }> } } };

export type JoinToGameMutationVariables = Exact<{
  teamId: Scalars['ID'];
  name: Scalars['String'];
}>;


export type JoinToGameMutation = { __typename?: 'Mutation', joinToGame: { __typename?: 'Player', id: string, name: string, team: { __typename?: 'Team', id: string, color: string } } };

export type SendAnswerMutationVariables = Exact<{
  answer: Scalars['String'];
}>;


export type SendAnswerMutation = { __typename?: 'Mutation', sendAnswer: boolean };

export type StartGameMutationVariables = Exact<{ [key: string]: never; }>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'Game', id: string, status: GameStatus } };

export type YieldQuestionMutationVariables = Exact<{ [key: string]: never; }>;


export type YieldQuestionMutation = { __typename?: 'Mutation', yieldQuestion: { __typename?: 'Question', id: string, text: string } };

export type GameSubscriptionVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type GameSubscription = { __typename?: 'Subscription', gameInfo: { __typename?: 'Game', id: string, teams: Array<{ __typename?: 'Team', id: string, color: string, players: Array<{ __typename?: 'Player', id: string, name: string }> }> } };

export type RoundSubscriptionVariables = Exact<{
  gameId: Scalars['ID'];
}>;


export type RoundSubscription = { __typename?: 'Subscription', state: { __typename?: 'Round', status: GameStatus, stage: { __typename?: 'Stage', question: string, answeringPlayers: Array<{ __typename?: 'AnsweringPlayer', id: string, text?: string | null }> }, board: { __typename?: 'Board', answersNumber: number, discoveredAnswers: Array<{ __typename?: 'GameAnswer', id: string, label: string, order: number, points: number }>, teams: Array<{ __typename?: 'GameTeam', color: TeamColor, failures: number, points: number }> } } };


export const CreateGameDocument = gql`
    mutation createGame($input: CreateGameInput!) {
  createGame(gameInput: $input) {
    ... on MutationCreateGameSuccess {
      data {
        id
        teams {
          players {
            id
            name
            team {
              id
              color
            }
          }
        }
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
export const SendAnswerDocument = gql`
    mutation SendAnswer($answer: String!) {
  sendAnswer(answer: $answer)
}
    `;
export type SendAnswerMutationFn = Apollo.MutationFunction<SendAnswerMutation, SendAnswerMutationVariables>;

/**
 * __useSendAnswerMutation__
 *
 * To run a mutation, you first call `useSendAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendAnswerMutation, { data, loading, error }] = useSendAnswerMutation({
 *   variables: {
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useSendAnswerMutation(baseOptions?: Apollo.MutationHookOptions<SendAnswerMutation, SendAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendAnswerMutation, SendAnswerMutationVariables>(SendAnswerDocument, options);
      }
export type SendAnswerMutationHookResult = ReturnType<typeof useSendAnswerMutation>;
export type SendAnswerMutationResult = Apollo.MutationResult<SendAnswerMutation>;
export type SendAnswerMutationOptions = Apollo.BaseMutationOptions<SendAnswerMutation, SendAnswerMutationVariables>;
export const StartGameDocument = gql`
    mutation StartGame {
  startGame {
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
export const YieldQuestionDocument = gql`
    mutation YieldQuestion {
  yieldQuestion {
    id
    text
  }
}
    `;
export type YieldQuestionMutationFn = Apollo.MutationFunction<YieldQuestionMutation, YieldQuestionMutationVariables>;

/**
 * __useYieldQuestionMutation__
 *
 * To run a mutation, you first call `useYieldQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useYieldQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [yieldQuestionMutation, { data, loading, error }] = useYieldQuestionMutation({
 *   variables: {
 *   },
 * });
 */
export function useYieldQuestionMutation(baseOptions?: Apollo.MutationHookOptions<YieldQuestionMutation, YieldQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<YieldQuestionMutation, YieldQuestionMutationVariables>(YieldQuestionDocument, options);
      }
export type YieldQuestionMutationHookResult = ReturnType<typeof useYieldQuestionMutation>;
export type YieldQuestionMutationResult = Apollo.MutationResult<YieldQuestionMutation>;
export type YieldQuestionMutationOptions = Apollo.BaseMutationOptions<YieldQuestionMutation, YieldQuestionMutationVariables>;
export const GameDocument = gql`
    subscription Game($gameId: String!) {
  gameInfo(gameId: $gameId) {
    id
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
export const RoundDocument = gql`
    subscription Round($gameId: ID!) {
  state(gameId: $gameId) {
    stage {
      answeringPlayers {
        id
        text
      }
      question
    }
    board {
      discoveredAnswers {
        id
        label
        order
        points
      }
      answersNumber
      teams {
        color
        failures
        points
      }
    }
    status
  }
}
    `;

/**
 * __useRoundSubscription__
 *
 * To run a query within a React component, call `useRoundSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRoundSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoundSubscription({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useRoundSubscription(baseOptions: Apollo.SubscriptionHookOptions<RoundSubscription, RoundSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RoundSubscription, RoundSubscriptionVariables>(RoundDocument, options);
      }
export type RoundSubscriptionHookResult = ReturnType<typeof useRoundSubscription>;
export type RoundSubscriptionResult = Apollo.SubscriptionResult<RoundSubscription>;