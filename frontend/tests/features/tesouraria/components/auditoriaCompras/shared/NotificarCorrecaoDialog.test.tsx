import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificarCorrecaoDialog } from '../../../../../../src/features/tesouraria/components/auditoriaCompras/shared/NotificarCorrecaoDialog';

const mockCompra = {
  id: '1',
  vendedor_nome: 'Joao Vendedor',
} as any;

describe('NotificarCorrecaoDialog', () => {
  it('does not render if compra is null', () => {
    const { container } = render(
      <NotificarCorrecaoDialog aberto={true} compra={null} notificando={false} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows error if message is too short and resets it on change', () => {
    const onSubmit = vi.fn();
    render(
      <NotificarCorrecaoDialog aberto={true} compra={mockCompra} notificando={false} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    
    const input = screen.getByLabelText(/O que precisa ser corrigido\?/i);
    fireEvent.change(input, { target: { value: 'abc' } });
    
    const form = document.querySelector('form')!;
    fireEvent.submit(form);
    
    expect(screen.getByText('A mensagem deve ter pelo menos 5 caracteres.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    // Change value again to reset error
    fireEvent.change(input, { target: { value: 'abcdef' } });
    expect(screen.queryByText('A mensagem deve ter pelo menos 5 caracteres.')).not.toBeInTheDocument();
  });

  it('calls onSubmit when message is valid', () => {
    const onSubmit = vi.fn();
    render(
      <NotificarCorrecaoDialog aberto={true} compra={mockCompra} notificando={false} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    
    const input = screen.getByLabelText(/O que precisa ser corrigido\?/i);
    fireEvent.change(input, { target: { value: 'Mensagem valida' } });
    
    const form = document.querySelector('form')!;
    fireEvent.submit(form);
    
    expect(onSubmit).toHaveBeenCalledWith('Mensagem valida');
  });

  it('calls onClose when close is requested and not notificando', () => {
    const onClose = vi.fn();
    render(
      <NotificarCorrecaoDialog aberto={true} compra={mockCompra} notificando={false} onClose={onClose} onSubmit={vi.fn()} />
    );
    
    const cancelBtn = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelBtn);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when notificando', () => {
    const onClose = vi.fn();
    render(
      <NotificarCorrecaoDialog aberto={true} compra={mockCompra} notificando={true} onClose={onClose} onSubmit={vi.fn()} />
    );
    
    const closeBtn = screen.getAllByRole('button')[0]; // IconButton for close
    fireEvent.click(closeBtn);
    
    expect(onClose).not.toHaveBeenCalled();
  });
});
