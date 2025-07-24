export enum DomainExceptionCode {
  //common
  NotFound = 1,
  BadRequest = 2,
  InternalServerError = 3,
  Forbidden = 4,
  ValidationError = 5,
  AlreadyExists = 6,
  AlreadyDeleted = 7,
  //auth
  Unauthorized = 11,
  EmailNotConfirmed = 12,
  ConfirmationCodeExpired = 13,
  PasswordRecoveryCodeExpired = 14,
  TooManyRequests = 15,
  //...
}
