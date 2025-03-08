import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const getColumnsCount = () => {
  if (typeof window === 'undefined') return 1;
  if (window.innerWidth >= 1536) return 6; // 2xl
  if (window.innerWidth >= 1280) return 5; // xl
  if (window.innerWidth >= 1024) return 4; // lg
  if (window.innerWidth >= 768) return 3; // md
  if (window.innerWidth >= 640) return 2; // sm
  return 1;
};

// Create a debounced version of getColumnsCount with 150ms delay
export const debouncedGetColumnsCount = debounce(() => {
  const columns = getColumnsCount();
  window.dispatchEvent(new CustomEvent('columnsChanged', {detail: columns}));
}, 150);
