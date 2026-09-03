import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PixTabTooltip } from '../../../../../../src/features/tesouraria/components/pix/layout/PixTabTooltip';

describe('PixTabTooltip', () => {
  it('renders correctly', () => {
    render(<PixTabTooltip descricao="Tooltip desc" />);
    // Tooltip material renders title only when hovered or focused, but icon is visible
    expect(screen.getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
  });

  it('stops event propagation on click and mouse down', () => {
    render(<PixTabTooltip descricao="Tooltip desc" />);
    
    // We can get the box element via parent of icon
    const icon = screen.getByTestId('InfoOutlinedIcon');
    const box = icon.parentElement!;
    
    const stopPropagationClick = vi.fn();
    const stopPropagationMouseDown = vi.fn();
    
    const clickEvent = new MouseEvent('click', { bubbles: true });
    clickEvent.stopPropagation = stopPropagationClick;
    
    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
    mouseDownEvent.stopPropagation = stopPropagationMouseDown;
    
    fireEvent(box, clickEvent);
    fireEvent(box, mouseDownEvent);
    
    expect(stopPropagationClick).toHaveBeenCalled();
    expect(stopPropagationMouseDown).toHaveBeenCalled();
  });
});
