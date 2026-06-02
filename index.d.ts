// Type definitions for react-smart-form-errors

import { ChangeEvent, FocusEvent } from 'react';

/**
 * Validation Error Object
 */
export interface ValidationError {
  type: string;
  rule?: string;
  reason?: string;
  value?: any;
}

/**
 * Validation Rule - can be string, object, or function
 */
export type ValidationRule =
  | string
  | ValidationRuleObject
  | ((value: any) => ValidationError | null);

/**
 * Validation Rule Object with options
 */
export interface ValidationRuleObject {
  rule: string;
  [key: string]: any;
}

/**
 * Validation Rules Map
 */
export interface ValidationRulesMap {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

/**
 * Error Messages Configuration
 */
export interface ErrorMessages {
  [key: string]: ((fieldName: string, value?: any) => string) | ErrorMessages;
}

/**
 * useSmartForm Hook Configuration
 */
export interface UseSmartFormConfig {
  initialValues?: Record<string, any>;
  rules?: ValidationRulesMap;
  messages?: ErrorMessages;
}

/**
 * useSmartForm Hook Return Type
 */
export interface UseSmartFormReturn {
  // State
  values: Record<string, any>;
  errors: Record<string, ValidationError | undefined>;
  touched: Record<string, boolean>;

  // Validation methods
  validateField: (fieldName: string, fieldValue: any) => ValidationError | null;
  validateForm: () => boolean;
  getFieldError: (fieldName: string) => string | null;

  // State setters
  setValue: (fieldName: string, value: any) => void;
  setError: (fieldName: string, error: ValidationError | undefined) => void;
  setValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  setTouched: (touched: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  resetForm: () => void;

  // Event handlers
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

  // Computed state
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Main hook for form validation
 */
export function useSmartForm(config?: UseSmartFormConfig): UseSmartFormReturn;

/**
 * Validator Functions
 */

/**
 * Validates required field
 */
export function validateRequired(value: any): ValidationError | null;

/**
 * Validates email format
 */
export function validateEmail(value: string): ValidationError | null;

/**
 * Validates phone number
 */
export function validatePhone(value: string): ValidationError | null;

/**
 * Validates password strength
 */
export function validatePassword(
  value: string,
  options?: { minLength?: number }
): ValidationError | null;

/**
 * Validates date of birth
 */
export function validateDOB(
  value: string | Date,
  options?: { minAge?: number }
): ValidationError | null;

/**
 * Validates full name
 */
export function validateFullName(value: string): ValidationError | null;

/**
 * Validates first name
 */
export function validateFirstName(value: string): ValidationError | null;

/**
 * Validates last name
 */
export function validateLastName(value: string): ValidationError | null;

/**
 * Validates username
 */
export function validateUsername(
  value: string,
  options?: { minLength?: number; maxLength?: number }
): ValidationError | null;

/**
 * Validates URL
 */
export function validateURL(value: string): ValidationError | null;

/**
 * Validates number
 */
export function validateNumber(
  value: string | number,
  options?: { min?: number; max?: number }
): ValidationError | null;

/**
 * Validates confirm password
 */
export function validateConfirmPassword(
  value: string,
  options?: { password?: string }
): ValidationError | null;

/**
 * Validates minimum length
 */
export function validateMinLength(
  value: string,
  options?: { length?: number }
): ValidationError | null;

/**
 * Validates maximum length
 */
export function validateMaxLength(
  value: string,
  options?: { length?: number }
): ValidationError | null;

/**
 * Validates against pattern
 */
export function validatePattern(
  value: string,
  options?: { regex?: RegExp | string }
): ValidationError | null;

/**
 * Validators object
 */
export const validators: {
  required: typeof validateRequired;
  email: typeof validateEmail;
  phone: typeof validatePhone;
  password: typeof validatePassword;
  dob: typeof validateDOB;
  fullname: typeof validateFullName;
  firstName: typeof validateFirstName;
  lastName: typeof validateLastName;
  username: typeof validateUsername;
  url: typeof validateURL;
  number: typeof validateNumber;
  confirmPassword: typeof validateConfirmPassword;
  minLength: typeof validateMinLength;
  maxLength: typeof validateMaxLength;
  pattern: typeof validatePattern;
};

/**
 * Default error messages
 */
export const messages: ErrorMessages;

/**
 * Convert field name to readable label
 */
export function getFieldLabel(fieldName: string): string;

/**
 * Get error message for a validation error
 */
export function getErrorMessage(
  error: ValidationError | null,
  fieldName: string,
  messages: ErrorMessages
): string;

/**
 * Format field name (legacy, use getFieldLabel instead)
 */
export function formatFieldName(fieldName: string): string;
