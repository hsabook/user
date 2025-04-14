import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'isomorphic-dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date string to dd/mm/yyyy format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
}

/**
 * Làm sạch HTML để tránh XSS
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'hr', 'i', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'table', 'tbody',
      'td', 'th', 'thead', 'tr', 'ul'
    ],
    ALLOWED_ATTR: ['href', 'target', 'class', 'id', 'style']
  });
}

/**
 * Làm sạch HTML và trích xuất văn bản thuần
 */
export function sanitizeAndExtractText(html: string, maxLength: number = 150): string {
  if (!html) return '';
  
  // Làm sạch HTML
  const cleanHtml = sanitizeHtml(html);
  
  // Tạo một container tạm thời
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;
    
    // Lấy nội dung văn bản
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Cắt ngắn nếu quá dài
    if (maxLength > 0 && textContent.length > maxLength) {
      return textContent.substring(0, maxLength) + '...';
    }
    
    return textContent;
  } else {
    // Fallback cho server-side
    return cleanHtml.replace(/<[^>]*>/g, '').substring(0, maxLength) + '...';
  }
}
