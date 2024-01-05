import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false; // No token or invalid format
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
      const decoded = await jwt.verify(token, process.env.SECERET_KEY);
      request.user = decoded; // Attach decoded user data to the request
      return true; // Token is valid
    } catch (error) {
      return false; // Token is invalid
    }
  }
}
