import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard('jwt-access-token') {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            return null;
        }

        return user;
    }
}
