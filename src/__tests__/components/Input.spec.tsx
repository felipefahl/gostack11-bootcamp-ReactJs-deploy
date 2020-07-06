import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField: () => ({
      fieldName: 'inputName',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    }),
  };
});

describe('Input Component', () => {
  it('Should be able to render an Input', async () => {
    const { getByPlaceholderText } = render(
      <Input name="inputName" placeholder="inputPlaceholder" />,
    );

    expect(getByPlaceholderText('inputPlaceholder')).toBeTruthy();
  });

  it('Should render highlight on focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="inputName" placeholder="inputPlaceholder" />,
    );

    const input = getByPlaceholderText('inputPlaceholder');
    const inputContainer = getByTestId('input-container-test');

    fireEvent.focus(input);

    await wait(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(input);

    await wait(() => {
      expect(inputContainer).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainer).not.toHaveStyle('color: #ff9000');
    });
  });

  it('Should keep border highlight when isFilled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="inputName" placeholder="inputPlaceholder" />,
    );

    const input = getByPlaceholderText('inputPlaceholder');
    const inputContainer = getByTestId('input-container-test');

    fireEvent.change(input, {
      target: {
        value: 'email@email.com',
      },
    });

    fireEvent.blur(input);

    await wait(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });
  });
});
