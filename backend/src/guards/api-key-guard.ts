import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Guard que valida el header `x-api-key` en cada request.
 *
 * Uso: aplícalo globalmente en main.ts o por controlador con @UseGuards(ApiKeyGuard)
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Lee la clave que manda el cliente en el header
    const clientKey = request.headers['x-api-key'];

    // Lee la clave esperada desde variables de entorno (nunca hardcodeada)
    const validKey = process.env.API_KEY;

    if (!validKey) {
      // Si el servidor no tiene API_KEY configurada, bloqueamos todo
      // Esto evita correr en producción sin configurar el .env
      throw new UnauthorizedException('API key not configured on server');
    }

    if (!clientKey || clientKey !== validKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
