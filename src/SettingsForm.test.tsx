import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsForm } from './SettingsForm';

describe('SettingsForm', () => {
  it('submits successfully with valid input and calls onSubmitSuccess with parsed values', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();

    render(<SettingsForm onSubmitSuccess={handleSuccess} />);

    await user.type(screen.getByLabelText(/username/i), 'jdoe');
    await user.type(screen.getByLabelText(/email/i), 'jdoe@example.com');
    await user.type(screen.getByLabelText(/bio/i), 'Frontend engineer.');
    await user.click(screen.getByLabelText(/dark mode/i));

    await user.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    });

    expect(handleSuccess).toHaveBeenCalledWith({
      username: 'jdoe',
      email: 'jdoe@example.com',
      bio: 'Frontend engineer.',
      darkMode: true,
    });

    // Success status message is shown, no error alerts present.
    expect(await screen.findByRole('status')).toHaveTextContent(
      /saved successfully/i
    );
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('blocks submission and surfaces accessible errors for invalid input', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();

    render(<SettingsForm onSubmitSuccess={handleSuccess} />);

    // Username too short, email invalid, bio left blank (valid/optional).
    await user.type(screen.getByLabelText(/username/i), 'ab');
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');

    await user.click(screen.getByRole('button', { name: /save settings/i }));

    const usernameInput = await screen.findByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Submission was blocked.
    expect(handleSuccess).not.toHaveBeenCalled();

    // aria-invalid is set dynamically on the offending fields.
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    // aria-describedby points to the corresponding inline error message.
    expect(usernameInput).toHaveAttribute(
      'aria-describedby',
      'username-error'
    );
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');

    expect(screen.getByText(/at least 3 characters/i)).toHaveAttribute(
      'id',
      'username-error'
    );
    expect(screen.getByText(/valid email address/i)).toHaveAttribute(
      'id',
      'email-error'
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('rejects a bio longer than 200 characters', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();
    const longBio = 'x'.repeat(201);

    render(<SettingsForm onSubmitSuccess={handleSuccess} />);

    await user.type(screen.getByLabelText(/username/i), 'jdoe');
    await user.type(screen.getByLabelText(/email/i), 'jdoe@example.com');
    await user.type(screen.getByLabelText(/bio/i), longBio);

    await user.click(screen.getByRole('button', { name: /save settings/i }));

    const bioInput = await screen.findByLabelText(/bio/i);
    expect(bioInput).toHaveAttribute('aria-invalid', 'true');
    expect(bioInput).toHaveAttribute('aria-describedby', 'bio-error');
    expect(handleSuccess).not.toHaveBeenCalled();
  });
});
