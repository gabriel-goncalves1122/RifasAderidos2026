import { render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AderidosSwipeTransition } from "@/features/aderidos/components/shared/AderidosSwipeTransition";
import { aderidosMotion } from "@/shared/tokens/motion";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  useReducedMotion: () => false,
  motion: {
    div: ({
      children,
      transition,
      initial,
      exit,
      ...props
    }: {
      children: ReactNode;
      transition: { duration: number; ease: number[] };
      initial: { x: number };
      exit: { x: number };
    } & HTMLAttributes<HTMLDivElement>) => (
      <div
        {...props}
        data-duration={transition.duration}
        data-ease={JSON.stringify(transition.ease)}
        data-initial-x={initial.x}
        data-exit-x={exit.x}
      >
        {children}
      </div>
    ),
  },
}));

describe("AderidosSwipeTransition", () => {
  it("Deve usar uma transição snappy curta para a tela de recusadas", () => {
    render(
      <AderidosSwipeTransition visaoAtual="recusadas">
        <span>Correções</span>
      </AderidosSwipeTransition>,
    );

    const wrapper = screen.getByTestId("aderidos-swipe-transition");

    expect(wrapper).toHaveAttribute("data-visao", "recusadas");
    expect(wrapper).toHaveAttribute("data-duration", "0.1");
    expect(wrapper).toHaveAttribute("data-initial-x", "18");
    expect(wrapper).toHaveAttribute("data-exit-x", "-12");
    expect(wrapper).toHaveAttribute(
      "data-ease",
      JSON.stringify(aderidosMotion.framerEasing.snap),
    );
  });
});
