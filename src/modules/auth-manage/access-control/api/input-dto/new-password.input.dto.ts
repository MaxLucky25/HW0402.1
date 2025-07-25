// import { IsStringWithTrim } from 'src/core/decorators/validation/is-string-with-trim';
// import {
//   passwordConstraints,
//   recoveryCodeConstrains,
// } from 'src/modules/auth-manage/access-control/api/input-dto/auth-constraints';

import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  passwordConstraints,
  recoveryCodeConstrains,
} from './auth-constraints';

export class NewPasswordInputDto {
  @IsStringWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  newPassword: string;

  @IsStringWithTrim(
    recoveryCodeConstrains.minLength,
    recoveryCodeConstrains.maxLength,
  )
  recoveryCode: string;
}
