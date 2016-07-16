import {ApplicationState} from '../../src/shared/application-state';

describe('applicationstate object normalizer', () => {
  let applicationState: ApplicationState;

  beforeEach(() => {
    applicationState = new ApplicationState();
  });

  it('copies properties', () => {
    let normalized = <any>applicationState._normalize({
      a: 5,
      b: 'test'
    });

    expect(normalized.a).toBe(5);
    expect(normalized.b).toBe('test');
  });

  it('copies getter properties', () => {
    let obj = {};
    Object.defineProperty(obj, 'a', { get: function() { return 15; }, enumerable: true });
    let normalized = <any>applicationState._normalize(obj);

    expect(normalized.a).toBe(15);
  });

  it('handlers arrays', () => {
    let obj = {
      projects: [{
        a: 15
      }]
    };
    let normalized = <any>applicationState._normalize(obj);

    expect(normalized.projects[0].a).toBe(15);
  });

  it('handlers objects', () => {
    let obj = {
      something: {
        foo: 'bar'
      }
    };
    let normalized = <any>applicationState._normalize(obj);

    expect(normalized.something.foo).toBe('bar');
  });
});
