export type SanitizationType = 'log' | 'paymentId' | 'error' | 'strict';

export interface SanitizationOptions {
  type?: SanitizationType;
  maxLength?: number;
  redactSensitive?: boolean;
}

export function sanitize(input: any, options?: SanitizationOptions): string;
export function sanitizeForLog(input: any): string;
export function sanitizePaymentId(input: any): string;
export function sanitizeError(input: any): string;
export function sanitizeAgainstLogInjection(input: any): string;

export function removeComments(s: string): string;
export function removeHtmlTags(s: string): string;
export function removeAnsiSequences(s: string): string;
