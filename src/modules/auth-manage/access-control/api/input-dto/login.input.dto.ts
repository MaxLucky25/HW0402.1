import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import { loginConstraints, passwordConstraints } from './auth-constraints';

export class LoginInputDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  login: string;

  @IsStringWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  password: string;
}
