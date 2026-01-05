const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Execute code on the backend
 * @param {string} language - Programming language (e.g., 'python', 'javascript', 'java', 'cpp')
 * @param {string} code - Code to execute
 * @param {string} stdin - Standard input (optional)
 * @returns {Promise<Object>} Execution result with output, error, etc.
 */
export const executeCode = async (language, code, stdin = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/code-execution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        code,
        stdin,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Code execution error:', error);
    throw error;
  }
};

