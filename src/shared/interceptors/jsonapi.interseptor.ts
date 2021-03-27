import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Serializer as JSONAPISerializer,
  Error as JSONAPIError,
} from 'jsonapi-serializer';

@Injectable()
export class JSONAPIInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const data = await next.handle().toPromise();
    const UserSerializer = new JSONAPISerializer('users', {
      id: '_id',
      attributes: ['firstName', 'role'],
      meta: {
        totalPages: 21,
      },
      keyForAttribute: 'camelCase',
      topLevelLinks: {
        self: 'http://localhost/api/users?page[number]=7&page[size]=3',
        first: 'http://localhost/api/users?page[number]=1&page[size]=3',
        prev: 'http://localhost/api/users?page[number]=6&page[size]=3',
        next: 'http://localhost/api/users?page[number]=8&page[size]=3',
        last: 'http://localhost/api/users?page[number]=10&page[size]=3',
      },
      dataLinks: {
        self: 'http://localhost/api/users',
      },
      role: {
        id: '_id',
        ref: '_id',
        attributes: ['name'],
        relationshipLinks: {
          related: 'http://localhost/api/user-roles/6059bca3d6d2ca0f9046ab2f',
        },
      },
    });

    const userError = new JSONAPIError({
      status: '409',
      code: '409',
      source: { pointer: '/data/attributes/username' },
      title: 'Conflict',
      detail: 'The such user "sarhan" is exist.',
    });

    // console.log(JSON.stringify(userError, null, 2));
    // console.log(JSON.stringify(UserSerializer.serialize(data.result), null, 2));

    console.log(context);

    return next.handle();
  }
}
