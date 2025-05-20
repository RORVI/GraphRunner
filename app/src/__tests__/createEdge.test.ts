import { execute } from '../services/createEdge';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('createEdge (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should build a valid Gremlin query and submit', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: ['edge-ok'] });

    const input = {
      label: 'CONNECTED_TO',
      fromKey: 'ip',
      fromVal: '192.168.0.1',
      toKey: 'ip',
      toVal: '192.168.0.2',
      props: {
        protocol: 'TCP',
        port: '443',
      }
    };

    const result = await execute(input);

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`addE('CONNECTED_TO')`);
    expect(query).toContain(`.property('protocol', "TCP")`);
    expect(query).toContain(`.property('port', "443")`);
    expect(result).toEqual({ _items: ['edge-ok'] });
  });

  it('should default missing props to empty', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: [] });

    const input = {
      label: 'LINKS',
      fromKey: 'hostname',
      fromVal: 'device-A',
      toKey: 'hostname',
      toVal: 'device-B',
    };

    const result = await execute(input);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`addE('LINKS')`);
    expect(result).toEqual({ _items: [] });
  });

  it('should escape quotes in edge property values', async () => {
    mockSubmit.mockResolvedValueOnce({});

    const input = {
      label: 'CONNECTS',
      fromKey: 'name',
      fromVal: 'src',
      toKey: 'name',
      toVal: 'dst',
      props: {
        note: 'He said "reboot"'
      }
    };

    await execute(input);

    const submittedQuery = mockSubmit.mock.calls[0][0];
    expect(submittedQuery).toContain('He said \\\"reboot\\\"');
  });

  it('should throw when gremlin fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('kaboom'));

    await expect(
      execute({
        label: 'FAIL_LINK',
        fromKey: 'id',
        fromVal: '1',
        toKey: 'id',
        toVal: '2'
      })
    ).rejects.toThrow('kaboom');

    expect(mockSubmit).toHaveBeenCalled();
  });
});
