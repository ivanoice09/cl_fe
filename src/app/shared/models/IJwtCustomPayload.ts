// Il payload custom
export interface IJwtCustomPayload {
    // I nostri claims
    CustomId: string;
    email: string;
    role: string;
    // default claims
    exp: number;
    iss: string;
    aud: string;
}