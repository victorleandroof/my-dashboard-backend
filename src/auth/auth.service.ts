import { AuthDTO } from "./auth.dto";
import { LoginDTO } from "./login.dto";
import { JWE, JWK } from "node-jose";
import { EmptyError, from, Observable, of, throwError } from "rxjs";
import { AppConfig } from "src/configs/app.config";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import {Md5} from "md5-typescript";
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TokenPayload } from "./auth.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { InvalidLoginExpcetion } from "./auth.exceptions";

@Injectable()
export class AuthService {

    constructor( 
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ){}

    public login(loginDTO: LoginDTO): Observable<AuthDTO> {
        return from(this.userRepository.findOne({
            where: {
                password: Md5.init(loginDTO.password),
                username: loginDTO.username
            }
        })).pipe(
            map(userEntity => {
                if(userEntity){
                    return userEntity;
                }
                throw new EmptyError();
            }),
            mergeMap<UserEntity,Observable<TokenPayload>>(this.getTokenPayload),
            mergeMap(this.getTokenEncrypted),
            mergeMap<string, Observable<AuthDTO>>(this.getAuthDto),
            catchError(this.handlerException)
        )
    }

    public authentication(token: string): Observable<boolean> {
        return this.getTokenDecrypted(token).pipe(
            map((payloadString)=>{
                const payload = JSON.parse(payloadString) as TokenPayload;
                const expirationDate = new Date(payload.iat);
                const now = new Date();
                if(expirationDate.getTime() <= now.getTime()){
                    throw new InvalidLoginExpcetion();
                }
                return payload;
            }),
            mergeMap((tokenPayload)=> this.findUserById(tokenPayload.sub)),
            map(() => {
                return true;
            }),
            catchError(this.handlerException)
        );
    }

    private findUserById(id:string): Observable<UserEntity>{
        return from(this.userRepository.findOne(id)).pipe(
            map((userEntity:UserEntity)=>{
                if(userEntity) {
                    return userEntity;
                }
                throw new EmptyError();
            })
        );
    }

    private getTokenEncrypted(tokenPayload:TokenPayload) {
        return from(JWK.asKey(AppConfig.JWE_KEY_PUBLIC)).pipe(
            mergeMap(key => JWE.createEncrypt({format: 'compact'}, key)
                            .update(JSON.stringify(tokenPayload)).final()
                    )
        )
    }

    private getTokenDecrypted(token:string): Observable<string> {
        return from(JWK.asKey(AppConfig.JWE_KEY_PRIVATE)).pipe( 
            mergeMap(key => JWE.createDecrypt(key).decrypt(token)),
            mergeMap(decryptResult => {
                const payloadString = decryptResult.payload.toString('utf-8');
                return of(payloadString);
            })
        );
    }
    
    private handlerException(error) {
        console.log(error);
        if(error instanceof EmptyError){
            return throwError(new ForbiddenException());
        } else if (error instanceof InvalidLoginExpcetion){
            return throwError(new ForbiddenException());
        }
        return throwError(new InternalServerErrorException(error.message));
    }

    private getTokenPayload(userEntity: UserEntity): Observable<TokenPayload> {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + (5 * 60 * 60 * 1000));
        const tokenPayload: TokenPayload = {
            exp: now.getTime(),
            iat: expirationDate.getTime(),
            iss: AppConfig.ISS_TOKEN,
            sub: userEntity.id,
            username: userEntity.username
        };
        return of(tokenPayload);
    }

    private getAuthDto(token: string): Observable<AuthDTO> {
        const authDTO: AuthDTO = new AuthDTO();
        authDTO.context = 'Bearer';
        authDTO.token = token;
        return of(authDTO);
    }
}