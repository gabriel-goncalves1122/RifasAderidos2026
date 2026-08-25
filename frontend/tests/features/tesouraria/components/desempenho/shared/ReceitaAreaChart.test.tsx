import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReceitaAreaChart } from '../../../../../../src/features/tesouraria/components/desempenho/shared/ReceitaAreaChart';

// Mock ResponsiveContainer so it renders in JSDOM
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('ReceitaAreaChart', () => {
  it('renders empty state when data is empty', () => {
    render(<ReceitaAreaChart data={[]} />);
    expect(screen.getByText('Sem receita validada para exibir.')).toBeInTheDocument();
  });

  it('renders empty state when data is empty and compact is true', () => {
    render(<ReceitaAreaChart data={[]} compact={true} />);
    expect(screen.getByText('Sem receita validada para exibir.')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    const mockData = [
      { data: '01/01', valor: 100 },
      { data: '02/01', valor: 200 }
    ];
    render(<ReceitaAreaChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders chart when data is provided and compact is true', () => {
    const mockData = [
      { data: '01/01', valor: 100 },
      { data: '02/01', valor: 200 }
    ];
    render(<ReceitaAreaChart data={mockData} compact={true} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
