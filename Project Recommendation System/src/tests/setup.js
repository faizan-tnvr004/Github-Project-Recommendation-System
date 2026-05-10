/**
 * setup.js — Vitest global test setup
 *
 * PURPOSE:
 *   This file runs ONCE before any test file executes.
 *   It loads custom matchers from @testing-library/jest-dom into Vitest.
 *
 * WHAT IT ENABLES:
 *   Without this file, you can only use Vitest's built-in assertions:
 *     expect(element).toBeTruthy()        ← vague
 *
 *   With jest-dom matchers loaded, you get DOM-specific assertions:
 *     expect(element).toBeInTheDocument() ← clear: is it rendered?
 *     expect(element).toBeVisible()       ← is it visible to the user?
 *     expect(button).toBeDisabled()       ← is the button disabled?
 *     expect(input).toHaveValue('hello')  ← does the input contain text?
 *
 *   These make test failure messages much more readable.
 *
 * HOW IT IS REGISTERED:
 *   vite.config.js points to this file via:
 *     test: { setupFiles: ['./src/tests/setup.js'] }
 */

import '@testing-library/jest-dom'
