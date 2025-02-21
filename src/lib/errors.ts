
type ErrorType = 'AuthenticationError' | 'AuthorisationError';

type NNError = {
    error: ErrorType;
    message: string;
}

export type AuthenticationError = NNError & {
    error: "AuthenticationError";
    message: string;
}

export type AuthorisationError = NNError & {
    error: "AuthorisationError";
    message: string;
}