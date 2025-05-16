import { ExerciseSelector } from './ExerciseSelector';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getExercisesList } from '@/lib/actions/dashboard.actions';
import '@testing-library/jest-dom';

jest.mock('@/lib/actions/dashboard.actions');

const mockGetExercisesList = getExercisesList as jest.MockedFunction<typeof getExercisesList>;

describe('ExerciseSelector', () => {
  const mockOnExerciseChange = jest.fn();
  const mockExercises = ['Squat', 'Bench Press', 'Deadlift'];

  // Suppress console.error messages
  const originalConsoleError = console.error;
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetExercisesList.mockResolvedValue(mockExercises);
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetExercisesList.mockResolvedValue(mockExercises);
  });

  test('renders loading state', async () => {
    render(<ExerciseSelector initialExercise="" onExerciseChange={mockOnExerciseChange} />);
    
    await waitFor(() => {
      const loadingElement = screen.getByTestId('loading-skeleton');
      expect(loadingElement).toBeInTheDocument();
      expect(loadingElement).toHaveClass('w-full');
      expect(loadingElement).toHaveClass('h-12');
      expect(loadingElement).toHaveClass('bg-muted');
      expect(loadingElement).toHaveClass('rounded-md');
      expect(loadingElement).toHaveClass('animate-pulse');
    });
  });

  test('renders error state when loading fails', async () => {
    mockGetExercisesList.mockRejectedValueOnce(new Error('Failed to load exercises'));
    
    render(<ExerciseSelector initialExercise="" onExerciseChange={mockOnExerciseChange} />);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/error loading exercises/i);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.closest('div')).toHaveClass('bg-red-50');
      expect(errorElement.closest('div')).toHaveClass('border');
      expect(errorElement.closest('div')).toHaveClass('border-red-200');
      expect(errorElement.closest('div')).toHaveClass('rounded-md');
      expect(errorElement.closest('div')).toHaveClass('p-4');
      expect(errorElement).toHaveClass('text-red-700');
    });
  });

  test('renders no exercises message when no exercises found', async () => {
    mockGetExercisesList.mockResolvedValueOnce([]);
    
    render(<ExerciseSelector initialExercise="" onExerciseChange={mockOnExerciseChange} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no exercises found/i)).toBeInTheDocument();
    });
  });

  test('renders select with exercises', async () => {
    render(<ExerciseSelector initialExercise="" onExerciseChange={mockOnExerciseChange} />);
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      mockExercises.forEach((exercise: string) => {
        expect(screen.getByText(exercise)).toBeInTheDocument();
      });
    });
  });

  test('calls onExerciseChange when selection changes', async () => {
    render(<ExerciseSelector initialExercise="" onExerciseChange={mockOnExerciseChange} />);
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      userEvent.selectOptions(select, 'Squat');
      
      expect(mockOnExerciseChange).toHaveBeenCalledWith('Squat');
    });
  });

  test('maintains initial exercise selection', async () => {
    render(<ExerciseSelector initialExercise="Bench Press" onExerciseChange={mockOnExerciseChange} />);
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('Bench Press');
    });
  });
});
