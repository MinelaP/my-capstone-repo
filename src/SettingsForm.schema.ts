import { z } from 'zod';

export const settingsFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  darkMode: z.boolean(),
  bio: z
    .string()
    .max(200, { message: 'Bio must be 200 characters or fewer.' })
    .optional()
    .or(z.literal('')),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
