import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Protects any route — requires a valid Bearer JWT token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
