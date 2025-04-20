import { render, fireEvent } from '@testing-library/svelte';
import Board from './Board.svelte';

describe('Board', () => {
  it('renders a 5x5 grid of textarea cells', () => {
    const rooms = Array(25).fill('');
    const { container } = render(Board, { props: { rooms } });
    const textareas = container.querySelectorAll('textarea.cell-input');
    expect(textareas.length).toBe(25);
  });

  it('allows editing each cell and updates the value', async () => {
    const rooms = Array(25).fill('');
    const { container } = render(Board, { props: { rooms } });
    const textareas = container.querySelectorAll('textarea.cell-input');
    await fireEvent.input(textareas[0], { target: { value: '테스트방' } });
    expect((textareas[0] as HTMLTextAreaElement).value).toBe('테스트방');
  });

  it('applies styleConfig to the board', () => {
    const rooms = Array(25).fill('');
    const styleConfig = {
      color: '#ff0000',
      bgColor: '#00ff00',
      font: 'monospace',
    };
    const { container } = render(Board, { props: { rooms, styleConfig } });
    const board = container.querySelector('.board-grid') as HTMLElement;
    expect(board).toHaveStyle('background: #00ff00');
    expect(board).toHaveStyle('font-family: monospace');
    expect(board).toHaveStyle('color: #ff0000');
  });
});
