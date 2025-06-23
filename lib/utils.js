import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names using clsx and then merges tailwind classes using tailwind-merge
 * @param  {...any} inputs - Class names to combine
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'RM') {
  return `${currency}${amount.toFixed(2)}`
}

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Creates a random ID
 * @param {number} length - Length of the ID
 * @returns {string} - Random ID
 */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, length + 2)
}

/**
 * Gets a value from local storage with JSON parsing
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} - Parsed value or default
 */
export function getLocalStorage(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue
  const value = localStorage.getItem(key)
  if (value === null) return defaultValue
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

/**
 * Sets a value in local storage with JSON stringification
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export function setLocalStorage(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    key,
    typeof value === 'string' ? value : JSON.stringify(value)
  )
}

/**
 * Removes a value from local storage
 * @param {string} key - Storage key
 */
export function removeLocalStorage(key) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}