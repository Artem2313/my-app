import React from 'react';
import {jest, describe, expect, test, beforeEach} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../AppLink';

describe('AppLink component', () => {
  let onClick;

  beforeEach(() => {
    onClick = jest.fn();

    render(<AppLink onClick={onClick} />);
  });

  test('title is correct', () => {
    const titleEl = screen.queryByText('Confirm');
    expect(titleEl.tagName.toLowerCase()).toBe('h3');
  });

  test('description is correct', () => {
    expect(
      screen.queryByText(
        "Lorem Ipsum"
      )
    ).toBeInTheDocument();
  });

  test('image is correct', () => {
    expect(screen.queryByRole('img').src.endsWith('icon.svg')).toBe(true);
  });

  describe('anchor tag', () => {
    let anchor;

    beforeEach(() => {
      anchor = screen.queryByText('Find Out More');
    });

    test('tagName is correct', () => {
      expect(anchor.tagName.toLowerCase()).toBe('a');
    });

    test('target attribute is correct', () => {
      expect(anchor).not.toHaveAttribute('target');
    });

    test('title attribute is correct', () => {
      expect(anchor).toHaveAttribute(
        'title',
        'Lorem'
      );
    });

    test('rel attribute is correct', () => {
      expect(anchor).not.toHaveAttribute('rel');
    });

    test('href attribute is correct', () => {
      expect(anchor).toHaveAttribute('href', '/mortgage/in-principle-approval');
    });

    test('onClick should be called', () => {
      fireEvent.click(anchor);
      expect(onClick).toBeCalledTimes(1);
    });
  });
});

