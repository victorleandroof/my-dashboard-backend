import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private readonly authService: AuthService){}

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const headerAuthoriazation = request.headers.authorization;
        if(!headerAuthoriazation) {
            throw new ForbiddenException();
        }
        const tokenWitoutContext = headerAuthoriazation.replace('Bearer ','');
        return this.authService.authentication(tokenWitoutContext);
    }

}