
interface RegisterInput {
  email: string;
  password: string;
}

export function validateRegister(options: RegisterInput) {
  const errors: { field: string; message: string }[] = [];
  
  //TODO: real email validation
  if (!options.email.includes('@')) {
    errors.push({ field: "email", message: "Email must be valid." });
  }
  
  if (!options.password || options.password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters long." });
  }
  
  return errors.length > 0 ? errors : null;
}

export function validateNewPass(newPassword: string) {
  const errors: { field: string; message: string }[] = [];
  
  if (!newPassword || newPassword.length < 6) {
    errors.push({ field: "newPassword", message: "New password must be at least 6 characters long." });
  }
  
  return errors.length > 0 ? errors : null;
}