import { describe, it, expect } from 'vitest';
import { SignupInputSchema, LoginInputSchema, type SignupInput, type LoginInput } from './types';

describe('SignupInputSchema', () => {
  describe('valid inputs', () => {
    it('should accept valid signup data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'ValidPass123!'
      };
      
      const result = SignupInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept password with various special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '[', ']', '{', '}', ';', "'", ':', '"', '\\', '|', ',', '.', '<', '>', '/', '?', '~'];
      
      specialChars.forEach(char => {
        const validData = {
          email: 'user@example.com',
          password: `ValidPass123${char}`
        };
        
        const result = SignupInputSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('email validation', () => {
    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..double.dot@example.com',
        'user@.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const result = SignupInputSchema.safeParse({
          email,
          password: 'ValidPass123!'
        });
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
        }
      });
    });

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      
      const result = SignupInputSchema.safeParse({
        email: longEmail,
        password: 'ValidPass123!'
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('email') && issue.message === 'Email too long'
        )).toBe(true);
      }
    });

    it('should accept email at maximum length', () => {
      const maxLengthEmail = 'a'.repeat(242) + '@example.com'; // 254 chars total
      
      const result = SignupInputSchema.safeParse({
        email: maxLengthEmail,
        password: 'ValidPass123!'
      });
      
      expect(result.success).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should reject password shorter than 8 characters', () => {
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: 'Short1!'
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && issue.message === 'Password must be at least 8 characters'
        )).toBe(true);
      }
    });

    it('should reject password longer than 256 characters', () => {
      const longPassword = 'A1!' + 'a'.repeat(254);
      
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: longPassword
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && issue.message === 'Password too long'
        )).toBe(true);
      }
    });

    it('should accept password at maximum length', () => {
      const maxPassword = 'A1!' + 'a'.repeat(253); // 256 chars total
      
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: maxPassword
      });
      
      expect(result.success).toBe(true);
    });

    it('should reject password without uppercase letter', () => {
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: 'lowercase123!'
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && 
          issue.message === 'Must include uppercase, lowercase, number, and special character.'
        )).toBe(true);
      }
    });

    it('should reject password without lowercase letter', () => {
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: 'UPPERCASE123!'
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && 
          issue.message === 'Must include uppercase, lowercase, number, and special character.'
        )).toBe(true);
      }
    });

    it('should reject password without number', () => {
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: 'ValidPassword!'
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && 
          issue.message === 'Must include uppercase, lowercase, number, and special character.'
        )).toBe(true);
      }
    });

    it('should reject password without special character', () => {
      const result = SignupInputSchema.safeParse({
        email: 'user@example.com',
        password: 'ValidPassword123'
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && 
          issue.message === 'Must include uppercase, lowercase, number, and special character.'
        )).toBe(true);
      }
    });
  });
});

describe('LoginInputSchema', () => {
  describe('valid inputs', () => {
    it('should accept valid login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'anypassword'
      };
      
      const result = LoginInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept simple password for login', () => {
      const validData = {
        email: 'user@example.com',
        password: '123'
      };
      
      const result = LoginInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..double.dot@example.com',
        'user@.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const result = LoginInputSchema.safeParse({
          email,
          password: 'anypassword'
        });
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
        }
      });
    });
  });

  describe('password validation', () => {
    it('should reject empty password', () => {
      const result = LoginInputSchema.safeParse({
        email: 'user@example.com',
        password: ''
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && issue.message === 'Password is required'
        )).toBe(true);
      }
    });

    it('should accept any non-empty password', () => {
      const passwords = ['1', 'a', '!', 'simple', 'complex123!@#'];
      
      passwords.forEach(password => {
        const result = LoginInputSchema.safeParse({
          email: 'user@example.com',
          password
        });
        
        expect(result.success).toBe(true);
      });
    });
  });
});

describe('Type inference', () => {
  it('should correctly infer SignupInput type', () => {
    const signupData: SignupInput = {
      email: 'test@example.com',
      password: 'ValidPass123!'
    };
    
    expect(typeof signupData.email).toBe('string');
    expect(typeof signupData.password).toBe('string');
  });

  it('should correctly infer LoginInput type', () => {
    const loginData: LoginInput = {
      email: 'test@example.com',
      password: 'anypassword'
    };
    
    expect(typeof loginData.email).toBe('string');
    expect(typeof loginData.password).toBe('string');
  });
});

describe('Edge cases and boundary tests', () => {
  it('should handle undefined values', () => {
    const signupResult = SignupInputSchema.safeParse({
      email: undefined,
      password: undefined
    });
    
    const loginResult = LoginInputSchema.safeParse({
      email: undefined,
      password: undefined
    });
    
    expect(signupResult.success).toBe(false);
    expect(loginResult.success).toBe(false);
  });

  it('should handle null values', () => {
    const signupResult = SignupInputSchema.safeParse({
      email: null,
      password: null
    });
    
    const loginResult = LoginInputSchema.safeParse({
      email: null,
      password: null
    });
    
    expect(signupResult.success).toBe(false);
    expect(loginResult.success).toBe(false);
  });

  it('should handle empty objects', () => {
    const signupResult = SignupInputSchema.safeParse({});
    const loginResult = LoginInputSchema.safeParse({});
    
    expect(signupResult.success).toBe(false);
    expect(loginResult.success).toBe(false);
  });

  it('should handle extra properties', () => {
    const dataWithExtra = {
      email: 'user@example.com',
      password: 'ValidPass123!',
      extraField: 'should be ignored'
    };
    
    const signupResult = SignupInputSchema.safeParse(dataWithExtra);
    const loginResult = LoginInputSchema.safeParse(dataWithExtra);
    
    expect(signupResult.success).toBe(true);
    expect(loginResult.success).toBe(true);
    
    if (signupResult.success) {
      expect('extraField' in signupResult.data).toBe(false);
    }
    if (loginResult.success) {
      expect('extraField' in loginResult.data).toBe(false);
    }
  });
});