import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
  This interceptor is responsible for formatting the JSON response as pretty JSON.
*/

@Injectable()
export class JsonPrettyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Check if we are in an HTTP context
        if (context.getType() === 'http') {
          const res: { setHeader: (name: string, value: string) => void } =
            context.switchToHttp().getResponse();

          // If data is an object or array, format it as pretty JSON
          if (
            data !== null &&
            typeof data === 'object' &&
            !Buffer.isBuffer(data)
          ) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            // Return stringified JSON - Express will send it as-is
            return JSON.stringify(data, null, 2);
          }
        }

        // Interceptors must handle any response type, so any is appropriate here
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }
}
