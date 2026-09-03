import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuditoriaCompraEdicaoDialog } from '../../../../../../src/features/tesouraria/components/auditoriaCompras/shared/AuditoriaCompraEdicaoDialog';

const mockCompra = {
  id: '1',
  compradorNome: 'Joao',
  compradorEmail: 'joao@example.com',
  compradorTelefone: '11999999999',
} as any;

describe('AuditoriaCompraEdicaoDialog', () => {
  it('renders correctly with compra data', () => {
    render(<AuditoriaCompraEdicaoDialog compra={mockCompra} salvando={false} onClose={vi.fn()} onSalvar={vi.fn()} />);
    expect(screen.getByDisplayValue('Joao')).toBeInTheDocument();
  });

  it('calls onSalvar with edited data and prevents default on form submit', async () => {
    const onSalvar = vi.fn().mockResolvedValue(true);
    render(<AuditoriaCompraEdicaoDialog compra={mockCompra} salvando={false} onClose={vi.fn()} onSalvar={onSalvar} />);
    
    const nameInput = screen.getByLabelText(/Nome do comprador/i);
    fireEvent.change(nameInput, { target: { value: 'Joao Editado' } });
    
    const phoneInput = screen.getByLabelText(/Telefone do comprador/i);
    fireEvent.change(phoneInput, { target: { value: '11988888888' } });
    
    const salvarBtn = screen.getByRole('button', { name: /Salvar alterações/i });
    fireEvent.click(salvarBtn);
    
    await waitFor(() => {
      expect(onSalvar).toHaveBeenCalledWith({
        nome: 'Joao Editado',
        email: 'joao@example.com',
        telefone: '(11) 98888-8888', // since formatarTelefone formats it
      });
    });

    // Also test form submit
    const form = document.getElementById('auditoria-compra-edicao-form') as HTMLFormElement;
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(onSalvar).toHaveBeenCalledTimes(2);
    });
  });

  it('does not call onSalvar if nome is invalid', () => {
    const onSalvar = vi.fn();
    render(<AuditoriaCompraEdicaoDialog compra={mockCompra} salvando={false} onClose={vi.fn()} onSalvar={onSalvar} />);
    
    const nameInput = screen.getByLabelText(/Nome do comprador/i);
    fireEvent.change(nameInput, { target: { value: '   ' } });
    
    const form = document.getElementById('auditoria-compra-edicao-form') as HTMLFormElement;
    fireEvent.submit(form);
    
    expect(onSalvar).not.toHaveBeenCalled();
  });
  
  it('does not call onSalvar if already salvando', () => {
    const onSalvar = vi.fn();
    render(<AuditoriaCompraEdicaoDialog compra={mockCompra} salvando={true} onClose={vi.fn()} onSalvar={onSalvar} />);
    
    const form = document.getElementById('auditoria-compra-edicao-form') as HTMLFormElement;
    fireEvent.submit(form);
    
    expect(onSalvar).not.toHaveBeenCalled();
  });
});
