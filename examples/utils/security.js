/**
 * Security utilities for examples
 * Provides safe logging and input sanitization
 *
 * ReDoS-hardened: avoids catastrophic backtracking by
 * 1) early length cap before any regex
 * 2) linear-time replacements for delimited templates ({{ }}, ${ }, backticks)
 * 3) linear-time stripping for <script>/<style> blocks
 */

/**
 * Advanced sanitization with configurable security levels
 * @param {any} input - Input to sanitize
 * @param {Object} options - Sanitization options
 * @param {string} options.type - Type: 'log', 'paymentId', 'error', 'strict'
 * @param {number} options.maxLength - Maximum length (default varies by type)
 * @param {boolean} options.redactSensitive - Redact sensitive data (default: true for error/strict)
 * @returns {string} Sanitized string safe for logging
 */
function sanitize(input, options = { type: 'log', maxLength: 100, redactSensitive: false }) {
  const normalizedInput = normalizeInput(input, options);
  if (typeof normalizedInput !== 'string') {
    return normalizedInput; // Early return for fallback values
  }

  const config = extractSanitizationConfig(options);
  let result = applySizeLimit(normalizedInput, config);

  if (config.type === 'paymentId') {
    return sanitizePaymentIdType(result, config.maxLength);
  }

  result = applyBasicNormalization(result);
  result = removeAnsiSequences(result);

  if (config.type === 'strict') {
    result = applyStrictSanitization(result);
  } else {
    result = applyBasicSanitization(result);
  }

  if (config.redactSensitive) {
    result = applyRedaction(result);
  } else {
    result = result.replace(/["']/g, '');
  }

  return result.slice(0, config.maxLength);
}

/**
 * Normalize input to string and handle special cases
 * @param {any} input - Input to normalize
 * @param {Object} options - Sanitization options
 * @returns {string|string} Normalized input or fallback value
 */
function normalizeInput(input, options) {
  if (typeof input === 'string') {
    return input;
  }

  const stringified = String(input);
  const isNullish = input == null || stringified === 'null' || stringified === 'undefined';

  if (options.type === 'paymentId' && isNullish) {
    return 'invalid_payment_id';
  }
  if (options.type === 'error' && isNullish) {
    return 'Unknown error';
  }

  return stringified;
}

/**
 * Extract and validate sanitization configuration
 * @param {Object} options - Raw options
 * @returns {Object} Validated configuration
 */
function extractSanitizationConfig(options) {
  const type = options.type || 'log';
  const maxLength = options.maxLength || getDefaultMaxLength(type);
  const redactSensitive = options.redactSensitive !== undefined 
    ? options.redactSensitive 
    : ['error', 'strict'].includes(type);

  return { type, maxLength, redactSensitive };
}

/**
 * Apply size limits to prevent pathological inputs
 * @param {string} input - Input string
 * @param {Object} config - Sanitization config
 * @returns {string} Size-limited string
 */
function applySizeLimit(input, config) {
  const HARD_CAP = Math.max(2000, Math.min(200_000, config.maxLength * 10));
  return input.slice(0, HARD_CAP);
}

/**
 * Sanitize payment ID type specifically
 * @param {string} input - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized payment ID
 */
function sanitizePaymentIdType(input, maxLength) {
  const cleaned = input.replace(/[^a-zA-Z0-9_-]/g, '');
  return cleaned === '' ? 'invalid_payment_id' : cleaned.slice(0, maxLength);
}

/**
 * Apply basic normalization (whitespace, etc.)
 * @param {string} input - Input string
 * @returns {string} Normalized string
 */
function applyBasicNormalization(input) {
  return input
    .replace(/\r?\n|\r|\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Apply strict sanitization rules
 * @param {string} input - Input string
 * @returns {string} Strictly sanitized string
 */
function applyStrictSanitization(input) {
  let result = removeJavaScriptEscapes(input);
  result = removeScriptStyleBlocks(result);
  result = neutralizeDangerousProtocols(result);
  result = removeTemplateExpressions(result);
  result = removeEventHandlers(result);
  result = removeHtmlTags(result);
  result = removeDangerousCharacters(result);
  result = removeComments(result);
  return result;
}

/**
 * Apply basic sanitization rules
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
function applyBasicSanitization(input) {
  let result = stripTagContent(input, 'script', '_SCRIPT_');
  result = result
    .replace(/[<>&`]/g, '')
    .replace(/(?:^|[^a-z])javascript:/gi, '_JS_')
    .replace(/\son\w+\s*=/gi, ' _EVENT_');
  return result;
}

/**
 * Remove JavaScript escape sequences
 * @param {string} input - Input string
 * @returns {string} String without JS escapes
 */
function removeJavaScriptEscapes(input) {
  return input
    .replace(/\\[rntfbav\\'"0]/g, '')
    .replace(/\\u[0-9a-fA-F]{4}/g, '')
    .replace(/\\x[0-9a-fA-F]{2}/g, '');
}

/**
 * Remove script and style blocks
 * @param {string} input - Input string
 * @returns {string} String without script/style blocks
 */
function removeScriptStyleBlocks(input) {
  let result = stripTagContent(input, 'script', '_SCRIPT_REMOVED_');
  result = stripTagContent(result, 'style', '_STYLE_REMOVED_');
  return result;
}

/**
 * Neutralize dangerous protocols
 * @param {string} input - Input string
 * @returns {string} String with neutralized protocols
 */
function neutralizeDangerousProtocols(input) {
  return input.replace(/(?:^|[^a-z])(javascript|vbscript|data|file):/gi, '_PROTO_');
}

/**
 * Remove template expressions
 * @param {string} input - Input string
 * @returns {string} String without template expressions
 */
function removeTemplateExpressions(input) {
  let result = replaceDelimitedAll(input, '{{', '}}', '_MUSTACHE_EXPR_');
  result = replaceDelimitedAll(result, '${', '}', '_TEMPLATE_EXPR_');
  result = replaceDelimitedAll(result, '`', '`', '_TEMPLATE_STR_');
  return result;
}

/**
 * Remove event handlers and dangerous attributes
 * @param {string} input - Input string
 * @returns {string} String without event handlers
 */
function removeEventHandlers(input) {
  return input
    .replace(/\son\w+\s*=\s*[^>\s"']+/gi, ' _EVENT_HANDLER_')
    .replace(/\ssrcdoc\s*=\s*[^>\s"']+/gi, ' _SRCDOC_')
    .replace(/\shref\s*=\s*[^>\s"']+/gi, ' _HREF_');
}

/**
 * Remove dangerous characters and sequences
 * @param {string} input - Input string
 * @returns {string} String without dangerous characters
 */
function removeDangerousCharacters(input) {
  return input
    .replace(/[<>&"'`]/g, '')
    .replace(/[;|&`$()]/g, '')
    .replace(/\.\.\//g, '_PATH_TRAVERSAL_');
}

/**
 * Apply redaction to sensitive information
 * @param {string} input - Input string
 * @returns {string} String with redacted sensitive info
 */
function applyRedaction(input) {
  return input
    .replace(/password|token|key|secret|api[_-]?key|auth|credential/gi, '_REDACTED_')
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '_CARD_')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '_EMAIL_')
    .replace(/["']/g, '');
}

/**
 * Replace all delimited segments with a replacement, in O(n).
 * Stops at unclosed segments and leaves them as-is.
 * @param {string} s
 * @param {string} open
 * @param {string} close
 * @param {string} replacement
 * @param {number} maxIter - safety bound on replacements
 */
function replaceDelimitedAll(s, open, close, replacement, maxIter = 10000) {
  if (!s) return s;
  
  const delimiters = { open, close, openLen: open.length, closeLen: close.length };
  let result = '';
  let currentIndex = 0;
  let iterations = 0;

  while (currentIndex < s.length && iterations < maxIter) {
    const segmentResult = processDelimitedSegment(s, currentIndex, delimiters, replacement);
    
    result += segmentResult.content;
    currentIndex = segmentResult.nextIndex;
    
    if (segmentResult.finished) break;
    iterations++;
  }

  // If iteration limit hit, append remainder to avoid infinite loops
  if (iterations >= maxIter) {
    result += s.slice(currentIndex);
  }
  
  return result;
}

/**
 * Process a single delimited segment
 * @param {string} s - Input string
 * @param {number} startIndex - Starting index
 * @param {Object} delimiters - Delimiter configuration
 * @param {string} replacement - Replacement string
 * @returns {Object} Processing result
 */
function processDelimitedSegment(s, startIndex, delimiters, replacement) {
  const openStart = s.indexOf(delimiters.open, startIndex);
  
  if (openStart === -1) {
    return {
      content: s.slice(startIndex),
      nextIndex: s.length,
      finished: true
    };
  }

  const beforeDelimiter = s.slice(startIndex, openStart);
  const closeStart = s.indexOf(delimiters.close, openStart + delimiters.openLen);
  
  if (closeStart === -1) {
    return {
      content: beforeDelimiter + s.slice(openStart),
      nextIndex: s.length,
      finished: true
    };
  }

  return {
    content: beforeDelimiter + replacement,
    nextIndex: closeStart + delimiters.closeLen,
    finished: false
  };
}

/**
 * Strip content of a given HTML-like tag in O(n) using indexOf scans.
 * Case-insensitive for tag names.
 * @param {string} s
 * @param {string} tag - e.g. 'script'
 * @param {string} replacement
 */
function stripTagContent(s, tag, replacement) {
  if (!s) return s;
  
  const tagPatterns = createTagPatterns(tag);
  let i = 0;
  let out = '';
  let guard = 0;

  while (i < s.length && guard < 10000) {
    const tagProcessResult = processNextTag(s, i, tagPatterns, replacement);
    
    if (tagProcessResult.found) {
      out += tagProcessResult.beforeTag;
      out += tagProcessResult.replacement;
      i = tagProcessResult.nextIndex;
    } else {
      out += s.slice(i);
      break;
    }
    
    guard++;
  }

  if (guard >= 10000) out += s.slice(i);
  return out;
}

/**
 * Create tag patterns for searching
 * @param {string} tag - Tag name
 * @returns {Object} Tag patterns
 */
function createTagPatterns(tag) {
  return {
    openLower: `<${tag}`,
    closeLower: `</${tag}>`
  };
}

/**
 * Process the next tag occurrence
 * @param {string} s - Input string
 * @param {number} i - Current index
 * @param {Object} patterns - Tag patterns
 * @param {string} replacement - Replacement string
 * @returns {Object} Processing result
 */
function processNextTag(s, i, patterns, replacement) {
  const start = s.toLowerCase().indexOf(patterns.openLower, i);
  
  if (start === -1) {
    return { found: false };
  }

  const beforeTag = s.slice(i, start);
  const afterOpen = s.indexOf('>', start);
  
  if (afterOpen === -1) {
    return {
      found: true,
      beforeTag: beforeTag,
      replacement: s.slice(start),
      nextIndex: s.length
    };
  }

  const end = s.toLowerCase().indexOf(patterns.closeLower, afterOpen + 1);
  
  if (end === -1) {
    return {
      found: true,
      beforeTag: beforeTag,
      replacement: replacement,
      nextIndex: s.length
    };
  }

  return {
    found: true,
    beforeTag: beforeTag,
    replacement: replacement,
    nextIndex: end + patterns.closeLower.length
  };
}

/**
 * Remove comments safely without ReDoS vulnerability
 * Uses linear scan instead of potentially dangerous regex
 * @param {string} s
 * @returns {string}
 */
function removeComments(s) {
  if (!s) return s;
  let result = '';
  let i = 0;
  
  while (i < s.length) {
    const blockCommentIndex = processBlockComment(s, i);
    if (blockCommentIndex > i) {
      result += '_COMMENT_';
      i = blockCommentIndex;
      continue;
    }
    
    const lineCommentIndex = processLineComment(s, i);
    if (lineCommentIndex > i) {
      result += '_COMMENT_';
      i = lineCommentIndex;
      continue;
    }
    
    result += s[i];
    i++;
  }
  
  return result;
}

/**
 * Process block comment starting at index i
 * @param {string} s - Input string
 * @param {number} i - Current index
 * @returns {number} New index after processing (same as i if no block comment found)
 */
function processBlockComment(s, i) {
  if (!isBlockCommentStart(s, i)) {
    return i;
  }
  
  let currentIndex = i + 2; // Skip /*
  currentIndex = findBlockCommentEnd(s, currentIndex);
  return currentIndex;
}

/**
 * Process line comment starting at index i
 * @param {string} s - Input string
 * @param {number} i - Current index
 * @returns {number} New index after processing (same as i if no line comment found)
 */
function processLineComment(s, i) {
  if (!isLineCommentStart(s, i)) {
    return i;
  }
  
  let currentIndex = i + 2; // Skip //
  currentIndex = findLineCommentEnd(s, currentIndex);
  return currentIndex;
}

/**
 * Check if current position is start of block comment
 * @param {string} s - Input string
 * @param {number} i - Current index
 * @returns {boolean} True if block comment starts at position
 */
function isBlockCommentStart(s, i) {
  return i < s.length - 1 && s[i] === '/' && s[i + 1] === '*';
}

/**
 * Check if current position is start of line comment
 * @param {string} s - Input string
 * @param {number} i - Current index
 * @returns {boolean} True if line comment starts at position
 */
function isLineCommentStart(s, i) {
  return i < s.length - 1 && s[i] === '/' && s[i + 1] === '/';
}

/**
 * Find end of block comment
 * @param {string} s - Input string
 * @param {number} startIndex - Index to start searching from
 * @returns {number} Index after block comment end
 */
function findBlockCommentEnd(s, startIndex) {
  let i = startIndex;
  while (i < s.length - 1 && !(s[i] === '*' && s[i + 1] === '/')) {
    i++;
  }
  return i < s.length - 1 ? i + 2 : i; // Skip */ if found
}

/**
 * Find end of line comment
 * @param {string} s - Input string
 * @param {number} startIndex - Index to start searching from
 * @returns {number} Index after line comment end
 */
function findLineCommentEnd(s, startIndex) {
  let i = startIndex;
  while (i < s.length && s[i] !== '\n' && s[i] !== '\r') {
    i++;
  }
  return i;
}

/**
 * Remove HTML tags safely without ReDoS vulnerability
 * Uses linear scan instead of potentially dangerous regex
 * @param {string} s
 * @returns {string}
 */
function removeHtmlTags(s) {
  if (!s) return s;
  let result = '';
  let i = 0;
  let inTag = false;
  
  while (i < s.length) {
    if (s[i] === '<') {
      if (!inTag) {
        result += '_HTML_TAG_';
        inTag = true;
      }
    } else if (s[i] === '>') {
      inTag = false;
    } else if (!inTag) {
      result += s[i];
    }
    i++;
  }
  
  return result;
}

/**
 * Remove ANSI escape sequences safely without using control characters in code
 * Detects ESC character (decimal 27) followed by ANSI patterns
 * @param {string} s
 * @returns {string}
 */
function removeAnsiSequences(s) {
  if (!s) return s;
  let result = '';
  let i = 0;
  
  while (i < s.length) {
    // Check for ESC character (ASCII 27) followed by [
    if (s.charCodeAt(i) === 27 && i + 1 < s.length && s[i + 1] === '[') {
      // Found ANSI escape sequence start
      i += 2; // Skip ESC and [
      
      // Skip numbers, semicolons until we find the command letter
      while (i < s.length) {
        const char = s[i];
        if ((char >= '0' && char <= '9') || char === ';') {
          i++;
        } else if (char === 'm' || char === 'K') {
          // Found ANSI command, skip it and break
          i++;
          break;
        } else {
          // Invalid ANSI sequence, stop processing
          break;
        }
      }
      continue;
    }
    
    result += s[i];
    i++;
  }
  
  return result;
}

/**
 * Get default max length for sanitization type
 * @param {string} type - Sanitization type
 * @returns {number} Default max length
 */
function getDefaultMaxLength(type) {
  switch (type) {
    case 'paymentId': return 50;
    case 'log':       return 100;
    case 'error':     return 200;
    case 'strict':    return 150;
    default:          return 100;
  }
}

// Convenience functions
const sanitizeForLog = (input) => sanitize(input, { 
  type: 'log', 
  maxLength: getDefaultMaxLength('log'),
  redactSensitive: false 
});
const sanitizePaymentId = (input) => sanitize(input, { 
  type: 'paymentId', 
  maxLength: getDefaultMaxLength('paymentId'),
  redactSensitive: true 
});
const sanitizeError = (input) => sanitize(input, { 
  type: 'error', 
  maxLength: getDefaultMaxLength('error'),
  redactSensitive: true 
});
const sanitizeAgainstLogInjection = (input) => sanitize(input, { 
  type: 'strict', 
  maxLength: getDefaultMaxLength('strict'),
  redactSensitive: true 
});

export {
  sanitize,
  sanitizeForLog,
  sanitizePaymentId,
  sanitizeError,
  sanitizeAgainstLogInjection
};
