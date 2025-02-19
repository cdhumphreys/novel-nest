
export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype)

    }
}

export class AuthorisationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthorisationError';
        Object.setPrototypeOf(this, AuthorisationError.prototype)

    }
}

