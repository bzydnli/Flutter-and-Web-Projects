/**
 * @typedef {Object} ITodo
 * @property {number} id
 * @property {string} todo
 * @property {boolean} completed
 */

/**
 * Yeni todo objesi üretir.
 * @param {string} todoText
 * @returns {ITodo}
 */
export const createTodo = (todoText) => ({
  id: Date.now(),
  todo: todoText,
  completed: false,
});
