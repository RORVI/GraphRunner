import { execute } from '../services/createVertex';
import { mockVertex } from '../__mocks__/dataFactories';
//import { mockSubmit } from '../__mocks__/gremlinClient';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('createVertex (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
    mockSubmit.mockImplementation(() => Promise.resolve({ _items: [] }));
  });

  it('should build a query with props and submit to gremlin', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: ['ok'] });

    const input = mockVertex();
    const result = await execute(input);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`g.addV('DEVICE')`);
    expect(query).toContain(`.property('ip', "192.168.0.42")`);
    expect(query).toContain(`.property('hostname', "unit-test-device")`);
    expect(result).toEqual({ _items: ['ok'] });
  });

  it('should handle input with only label and no properties', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: [] });

    const input = mockVertex({ ip: undefined, hostname: undefined });
    const result = await execute({ label: input.label });

    expect(mockSubmit).toHaveBeenCalledWith(`g.addV('${input.label}')`);
    expect(result).toEqual({ _items: [] });
  });

  it('should escape quotes in property values', async () => {
    mockSubmit.mockResolvedValueOnce({});

    const input = mockVertex({ description: `He said "run"` });
    await execute(input);

    const submittedQuery = mockSubmit.mock.calls[0][0];
    expect(submittedQuery).toContain(`He said \\\"run\\\"`);
  });

  it('should throw when gremlin fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Boom'));

    await expect(execute(mockVertex())).rejects.toThrow('Boom');
    expect(mockSubmit).toHaveBeenCalled();
  });
});
