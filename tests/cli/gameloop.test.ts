import { runGameLoop } from '../../src/cli/gameloop';

describe('gameloop module', () => {
  it('exports runGameLoop as a function', () => {
    expect(typeof runGameLoop).toBe('function');
  });

  it('runGameLoop accepts an optional difficulty parameter', () => {
    expect(runGameLoop.length).toBeLessThanOrEqual(1);
  });
});
