import { CrashableError } from 'src/exceptions';

/**
 * Exception for API error.
 */
export class AuthAzureError extends CrashableError {
  constructor(message: string) {
    super(message);
    this.name = AuthAzureError.name;
  }
}
