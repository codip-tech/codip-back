import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CognitoStrategy } from './strategies/cognito.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, CognitoStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}