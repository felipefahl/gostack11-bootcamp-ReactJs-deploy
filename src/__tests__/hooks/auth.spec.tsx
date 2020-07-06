import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const user = {
      id: 'user123',
      name: 'Romeu Cunha',
      email: 'email@email.com',
    };
    apiMock.onPost('sessions').replyOnce(200, {
      user,
      token: 'token123',
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'email@email.com',
      password: '123321',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', 'token123');
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user.email).toEqual('email@email.com');
  });

  it('should restore saved data from storage when auth inits', async () => {
    const user = {
      id: 'user123',
      name: 'Romeu Cunha',
      email: 'email@email.com',
    };

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify(user);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    expect(result.current.user.email).toEqual('email@email.com');
  });

  it('should be able to sign out', async () => {
    const user = {
      id: 'user123',
      name: 'Romeu Cunha',
      email: 'email@email.com',
    };

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify(user);
        default:
          return null;
      }
    });
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able update user data', async () => {
    const user = {
      id: 'user123',
      name: 'Romeu Cunha',
      email: 'email@email.com',
      avatar_url: 'image.png',
    };

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.updateUser(user);
    });

    expect(result.current.user.avatar_url).toEqual('image.png');
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
  });
});
