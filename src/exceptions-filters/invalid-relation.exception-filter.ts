import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InvalidRelationError } from '../errors/invalid-relation.error';

@Catch(InvalidRelationError)
export class InvalidRelationExceptionFilter extends BaseExceptionFilter {
  catch(exception: InvalidRelationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 422;

    return response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
