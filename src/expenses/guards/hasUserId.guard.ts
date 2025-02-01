import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { Observable } from 'rxjs';

export class hasUserId implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId || !isValidObjectId(userId)) {
      throw new BadRequestException('ivalid id is provaider');
    }

    request.userId = userId;

    return true;
  }
}
