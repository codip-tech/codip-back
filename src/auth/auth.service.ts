import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private cognito: CognitoIdentityServiceProvider;

  constructor(private configService: ConfigService) {
    this.cognito = new CognitoIdentityServiceProvider({
      region: this.configService.get('AWS_REGION'),
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: loginDto.email,
        PASSWORD: loginDto.password,
      },
    };

    const result = await this.cognito.initiateAuth(params).promise();
    
    return {
      accessToken: result.AuthenticationResult.AccessToken,
      refreshToken: result.AuthenticationResult.RefreshToken,
      idToken: result.AuthenticationResult.IdToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const params = {
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      Username: registerDto.email,
      Password: registerDto.password,
      UserAttributes: [
        { Name: 'email', Value: registerDto.email },
      ],
    };

    return await this.cognito.signUp(params).promise();
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    const result = await this.cognito.initiateAuth(params).promise();
    
    return {
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken,
    };
  }

  async validateUser(token: string): Promise<any> {
    const params = {
      AccessToken: token,
    };

    return await this.cognito.getUser(params).promise();
  }
}