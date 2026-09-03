import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResumoBarChart } from '../../../../../../src/features/tesouraria/components/desempenho/shared/ResumoBarChart';

vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('ResumoBarChart', () => {
  it('renders empty state when total is 0', () => {
    render(<ResumoBarChart data={[]} total={0} emptyMessage="Sem dados." />);
    expect(screen.getByText('Sem dados.')).toBeInTheDocument();
  });

  it('renders empty state when total is 0 and compact is true', () => {
    render(<ResumoBarChart data={[]} total={0} emptyMessage="Sem dados." compact={true} />);
    expect(screen.getByText('Sem dados.')).toBeInTheDocument();
  });

  it('renders chart when total is provided', () => {
    const mockData = [
      { label: 'A', valor: 10, cor: '#000' },
      { label: 'B', valor: 20, cor: '#fff' }
    ];
    render(<ResumoBarChart data={mockData} total={30} emptyMessage="Sem dados." />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders chart when total is provided and compact is true', () => {
    const mockData = [
      { label: 'A', valor: 10, cor: '#000' },
      { label: 'B', valor: 20, cor: '#fff' }
    ];
    render(<ResumoBarChart data={mockData} total={30} emptyMessage="Sem dados." compact={true} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
