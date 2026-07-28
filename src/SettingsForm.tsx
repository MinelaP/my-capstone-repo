import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  settingsFormSchema,
  type SettingsFormValues,
} from './SettingsForm.schema';

export interface SettingsFormProps {
  /**
   * Called with the validated form values on successful submit.
   */
  onSubmitSuccess?: (values: SettingsFormValues) => void;
  /**
   * Optional default values (e.g. when editing an existing user).
   */
  defaultValues?: Partial<SettingsFormValues>;
}

const DEFAULT_VALUES: SettingsFormValues = {
  username: '',
  email: '',
  darkMode: false,
  bio: '',
};

export function SettingsForm({
  onSubmitSuccess,
  defaultValues,
}: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
    mode: 'onSubmit',
  });

  const onSubmit = (values: SettingsFormValues) => {
    onSubmitSuccess?.(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="User settings"
    >
      {/* Username */}
      <div className="form-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          aria-invalid={errors.username ? 'true' : 'false'}
          aria-describedby={errors.username ? 'username-error' : undefined}
          {...register('username')}
        />
        {errors.username && (
          <p id="username-error" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="form-field">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          aria-invalid={errors.bio ? 'true' : 'false'}
          aria-describedby={errors.bio ? 'bio-error' : undefined}
          {...register('bio')}
        />
        {errors.bio && (
          <p id="bio-error" role="alert">
            {errors.bio.message}
          </p>
        )}
      </div>

      {/* Dark Mode */}
      <div className="form-field form-field--checkbox">
        <label htmlFor="darkMode">Dark Mode</label>
        <input
          id="darkMode"
          type="checkbox"
          aria-invalid={errors.darkMode ? 'true' : 'false'}
          aria-describedby={errors.darkMode ? 'darkMode-error' : undefined}
          {...register('darkMode')}
        />
        {errors.darkMode && (
          <p id="darkMode-error" role="alert">
            {errors.darkMode.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>

      {isSubmitSuccessful && (
        <p role="status">Settings saved successfully.</p>
      )}
    </form>
  );
}

export default SettingsForm;
