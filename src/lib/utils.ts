import { type ClassValue, clsx } from 'clsx'

/** Merge conditional class names together. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
