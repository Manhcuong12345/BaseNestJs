export interface IFAuthentication {
    readonly email: string;
    readonly password: string;
}

export interface IFAuthenticationGoogleOrFacebook {
    readonly accessToken: string;
}
