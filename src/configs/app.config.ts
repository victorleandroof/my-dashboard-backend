import { env } from 'process';

export abstract class AppConfig {
    public static readonly PORT: string = env.PORT;
    public static readonly DB_HOST: string = env.DB_HOST;
    public static readonly DB_USER: string = env.DB_USER;
    public static readonly DB_PASSWORD: string = env.DB_PASSWORD;
    public static readonly DB_PORT: string = env.DB_PORT;
    public static readonly RUNTIME: string = env.NODE_ENV;
    public static readonly DB_NAME: string = env.DB_NAME; 
    public static readonly JWE_KEY_PUBLIC: string = env.JWE_KEY_PUBLIC;
    public static readonly JWE_KEY_PRIVATE: string = env.JWE_KEY_PRIVATE;
    public static readonly ISS_TOKEN: string = env.ISS_TOKEN;
}