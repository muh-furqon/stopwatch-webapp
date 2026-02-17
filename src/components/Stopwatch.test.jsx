
import { render, screen } from '@testing-library/react';
import Stopwatch from './Stopwatch';
import { describe, it, expect } from 'vitest';

describe('Stopwatch Component', () => {
    it('renders the Start button', () => {
        render(<Stopwatch />);
        const startButton = screen.getByText(/Start/i);
        expect(startButton).toBeInTheDocument();
    });

    it('renders the initial time as 00', () => {
        render(<Stopwatch />);
        const timeDisplays = screen.getAllByText(/00/i); 
        expect(timeDisplays.length).toBeGreaterThan(0);
    });
});
