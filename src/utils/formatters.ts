/**
 * Formatting utilities for Indian Stock Broking
 * Complies with SEBI and Indian financial formatting norms.
 */

import { NumberFormatType } from '../types';

/**
 * Format a number using the Indian Lakh/Crore system:
 * e.g. 12345678.50 -> ₹1,23,45,678.50
 * If international format is selected: 12,345,678.50
 */
export function formatCurrency(
  amount: number,
  format: NumberFormatType = 'indian',
  includeSymbol: boolean = true,
  decimals: number = 2
): string {
  const prefix = includeSymbol ? '₹' : '';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (format === 'international') {
    const formatted = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${isNegative ? '-' : ''}${prefix}${formatted}`;
  }

  // Indian Lakh/Crore formatting:
  // Split into integer and decimal parts
  const fixed = absAmount.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  let result = '';
  const len = intPart.length;

  if (len <= 3) {
    result = intPart;
  } else {
    // Last 3 digits first
    const lastThree = intPart.substring(len - 3);
    const rest = intPart.substring(0, len - 3);
    // Group remaining in pairs of 2 from right to left
    const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${groupedRest},${lastThree}`;
  }

  const withDecimals = decimals > 0 ? `${result}.${decPart}` : result;
  return `${isNegative ? '-' : ''}${prefix}${withDecimals}`;
}

/**
 * Short Indian representations (e.g., ₹12.5L, ₹3.2Cr, ₹85.4K)
 */
export function formatShortCurrency(amount: number, includeSymbol: boolean = true): string {
  const prefix = includeSymbol ? '₹' : '';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let formatted = '';
  if (abs >= 10000000) {
    formatted = `${(abs / 10000000).toFixed(2)}Cr`;
  } else if (abs >= 100000) {
    formatted = `${(abs / 100000).toFixed(2)}L`;
  } else if (abs >= 1000) {
    formatted = `${(abs / 1000).toFixed(1)}k`;
  } else {
    formatted = abs.toFixed(2);
  }

  return `${isNegative ? '-' : ''}${prefix}${formatted}`;
}

/**
 * Derives the standard Indian Depository / Broker PDF statement password:
 * Rule: PAN in uppercase + DOB as DDMMYYYY
 * e.g., PAN "abcde1234f", DOB "15/08/1995" -> "ABCDE1234F15081995"
 */
export function derivePdfPassword(pan: string, dob: string): string {
  const cleanPan = pan.trim().toUpperCase();
  // Remove slashes or hyphens from DOB to ensure DDMMYYYY format
  const cleanDob = dob.replace(/[^0-9]/g, '');
  return `${cleanPan}${cleanDob}`;
}

/**
 * Mask Aadhaar number: returns XXXX-XXXX-1234
 */
export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length >= 4) {
    const lastFour = digits.slice(-4);
    return `XXXX-XXXX-${lastFour}`;
  }
  return 'XXXX-XXXX-XXXX';
}

/**
 * Mask Mobile: returns +91 98*** **421
 */
export function maskMobile(mobile: string): string {
  const clean = mobile.replace(/[^\d+]/g, '');
  if (clean.length >= 10) {
    const firstTwo = clean.slice(-10, -8);
    const lastThree = clean.slice(-3);
    return `+91 ${firstTwo}*** **${lastThree}`;
  }
  return mobile;
}

/**
 * Mask Email: returns aa****@gmail.com
 */
export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [user, domain] = parts;
  if (user.length <= 2) {
    return `${user[0]}***@${domain}`;
  }
  return `${user.substring(0, 2)}****@${domain}`;
}

/**
 * Mask Bank Account Number: returns •••• 4910
 */
export function maskBankAccount(acNumber: string): string {
  const clean = acNumber.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `•••• ${clean.slice(-4)}`;
  }
  return `•••• ${acNumber.slice(-4)}`;
}
