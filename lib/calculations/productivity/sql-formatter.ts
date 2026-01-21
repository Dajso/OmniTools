/**
 * SQL Formatter
 * 
 * Format and beautify SQL queries.
 * 
 * @module lib/calculations/productivity/sql-formatter
 */

export interface SQLFormatterInputs {
    sql: string;
    dialect: 'standard' | 'mysql' | 'postgresql' | 'sqlite';
    uppercase: boolean;
    indentSize: number;
}

export interface SQLFormatterResults {
    formatted: string;
    lineCount: number;
    keywordCount: number;
}

// SQL keywords for case conversion
const SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'AS',
    'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'CREATE DATABASE', 'CREATE INDEX', 'CREATE VIEW',
    'DROP', 'ALTER', 'ADD',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'UNIQUE', 'CHECK', 'DEFAULT',
    'NULL', 'AUTO_INCREMENT', 'SERIAL',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'UNION ALL', 'UNION', 'DISTINCT', 'EXISTS',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'ASC', 'DESC', 'NULLS FIRST', 'NULLS LAST',
    'WITH', 'RECURSIVE', 'OVER', 'PARTITION BY',
];

// Dialect-specific keywords
const DIALECT_KEYWORDS: Record<string, string[]> = {
    standard: [],
    mysql: ['AUTO_INCREMENT', 'ENGINE', 'CHARSET', 'COLLATE', 'IF EXISTS', 'IF NOT EXISTS'],
    postgresql: ['SERIAL', 'RETURNING', 'ILIKE', 'SIMILAR TO'],
    sqlite: ['AUTOINCREMENT', 'GLOB', 'PRAGMA', 'VACUUM', 'ATTACH', 'DETACH'],
};

/**
 * Format SQL query
 */
export function formatSQL(inputs: SQLFormatterInputs): SQLFormatterResults {
    const { sql, dialect, uppercase, indentSize } = inputs;

    if (!sql.trim()) {
        return {
            formatted: '',
            lineCount: 0,
            keywordCount: 0,
        };
    }

    const indent = ' '.repeat(indentSize);

    // Combine standard keywords with dialect-specific ones
    const allKeywords = [...SQL_KEYWORDS, ...(DIALECT_KEYWORDS[dialect] || [])];
    // Sort by length descending so longer keywords are matched first
    allKeywords.sort((a, b) => b.length - a.length);

    // Normalize whitespace
    let formatted = sql.trim().replace(/\s+/g, ' ');

    // Count keywords
    let keywordCount = 0;
    allKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matches = formatted.match(regex);
        if (matches) keywordCount += matches.length;
    });

    // Apply keyword case (process longer keywords first)
    allKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        formatted = formatted.replace(regex, uppercase ? keyword.toUpperCase() : keyword.toLowerCase());
    });

    // Keywords that trigger a new line (longer ones first)
    const lineBreakKeywords = [
        'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN',
        'ORDER BY', 'GROUP BY', 'INSERT INTO', 'DELETE FROM',
        'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'ON',
        'HAVING', 'LIMIT', 'OFFSET', 'SET', 'VALUES', 'UNION'
    ];

    // Add newlines before major keywords
    lineBreakKeywords.forEach(keyword => {
        const kw = uppercase ? keyword.toUpperCase() : keyword.toLowerCase();
        // Use lookbehind to ensure we're not at the start of string
        const regex = new RegExp(`\\s+${kw}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${kw}`);
    });

    // Handle commas - put each column on its own line
    formatted = formatted.replace(/,\s*/g, `,\n`);

    // Split into lines
    const lines = formatted.split('\n');
    const result: string[] = [];

    // Regex for main clause keywords (should NOT be indented)
    const mainClausePattern = new RegExp(
        '^(' + [
            'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
            'LIMIT', 'OFFSET', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
            'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR',
            'UNION', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'SET', 'VALUES'
        ].join('|') + ')\\b',
        'i'
    );

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check if this line starts with a main clause keyword
        if (mainClausePattern.test(trimmed)) {
            result.push(trimmed);
        } else {
            // This is a field/column - add indent
            result.push(indent + trimmed);
        }
    }

    return {
        formatted: result.join('\n'),
        lineCount: result.length,
        keywordCount,
    };
}

/**
 * SQL dialect options
 */
export const SQL_DIALECTS = [
    { id: 'standard', name: 'Standard SQL' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'sqlite', name: 'SQLite' },
] as const;

/**
 * Example SQL for testing
 */
export const EXAMPLE_SQL = `SELECT users.id, users.name, orders.total FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.active = 1 AND orders.total > 100 ORDER BY orders.total DESC LIMIT 10`;
