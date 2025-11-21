/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*eslint-disable @typescript-eslint/no-unsafe-assignment*/
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = '123';
    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}
