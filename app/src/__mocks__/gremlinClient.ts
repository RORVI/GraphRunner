export const mockSubmit = jest.fn();

export function getGremlinClient() {
  return { submit: mockSubmit };
}