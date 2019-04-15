import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlushThunks } from 'redux-testkit';
import store from '..';
import { authenticateUser, isAuthenticated } from '../ducks/users';
import messages, { selectAllMessages, sendMessage } from './ducks/messages';

describe('store', () => {
  let flushThunks;

  beforeEach(() => {
    flushThunks = FlushThunks.createMiddleware();
    jest.resetAllMocks();
  });

  it('should be a redux store', () => {
    expect(typeof store.subscribe).toEqual('function');
    expect(typeof store.dispatch).toEqual('function');
    expect(typeof store.getState).toEqual('function');
    expect(typeof store.replaceReducer).toEqual('function');
  });

  it('should register a reducer', () => {
    reducerRegistry.register('messages', messages);
    expect(store.getState().messages).toEqual({ messages: [] });
  });

  it('should work with default reducers', () => {
    /** Users reducer */
    // initially logged out
    expect(isAuthenticated(store.getState())).toBe(false);
    // call action to log in
    store.dispatch(authenticateUser(true));
    // now should BE authenticated
    expect(isAuthenticated(store.getState())).toBe(true);
    // call action to log out
    store.dispatch(authenticateUser(false));
    // now should NOT be authenticated
    expect(isAuthenticated(store.getState())).toBe(false);
  });

  it('should be able to use loaded reducers', () => {
    reducerRegistry.register('messages', messages);
    // dispatch action should work
    store.dispatch(sendMessage({ user: 'bob', message: 'hello' }));
    expect(store.getState().messages).toEqual({ messages: [{ user: 'bob', message: 'hello' }] });
    // retrieving data should work
    expect(selectAllMessages(store.getState())).toEqual([{ message: 'hello', user: 'bob' }]);
  });
});
