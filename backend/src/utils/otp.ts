import crypto from "crypto";

/**
 * @returns {string} 
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**

 * @param {Date} createdAt 
 * @param {number} expiryMinutes
 * @returns {boolean}
 */
export const isOTPExpired = (createdAt: Date, expiryMinutes: number = 10): boolean => {
  const now = new Date();
  const diffInMinutes = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60);
  return diffInMinutes > expiryMinutes;
};