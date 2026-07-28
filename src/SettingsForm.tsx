import { useState } from "react";
import { Check, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

// ----- Validation rules -----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value, allValues) {
    switch (name) {
        case "name":
            if (!value.trim()) return "Name is required.";
            if (value.trim().length < 2) return "Name must be at least 2 characters.";
            return "";
        case "email":
            if (!value.trim()) return "Email is required.";
            if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
            return "";
        case "username":
            if (!value.trim()) return "Username is required.";
            if (!/^[a-zA-Z0-9_]{3,20}$/.test(value))
                return "3-20 characters, letters, numbers, and underscores only.";
            return "";
        case "newPassword":
            if (!value) return ""; // optional field
            if (value.length < 8) return "Password must be at least 8 characters.";
            if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
            if (!/[0-9]/.test(value)) return "Include at least one number.";
            return "";
        case "confirmPassword":
            if (!allValues.newPassword) return "";
            if (value !== allValues.newPassword) return "Passwords do not match.";
            return "";
        default:
            return "";
    }
}

function passwordStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
}

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-red-400", "bg-amber-400", "bg-teal-400", "bg-emerald-500"];

const initialValues = {
    name: "",
    email: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    productUpdates: false,
};

export default function UserSettingsForm() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [status, setStatus] = useState("idle"); // idle | saving | saved

    const fieldNames = ["name", "email", "username", "newPassword", "confirmPassword"];

    function handleChange(e) {
        const { name, type, checked, value } = e.target;
        const nextValue = type === "checkbox" ? checked : value;
        const nextValues = { ...values, [name]: nextValue };
        setValues(nextValues);

        if (touched[name] || errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, nextValue, nextValues),
                // re-check confirmPassword if the password itself changed
                ...(name === "newPassword" && touched.confirmPassword
                    ? { confirmPassword: validateField("confirmPassword", nextValues.confirmPassword, nextValues) }
                    : {}),
            }));
        }
        if (status === "saved") setStatus("idle");
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value, values) }));
    }

    function validateAll() {
        const nextErrors = {};
        fieldNames.forEach((name) => {
            nextErrors[name] = validateField(name, values[name], values);
        });
        return nextErrors;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const nextErrors = validateAll();
        setErrors(nextErrors);
        setTouched(
            fieldNames.reduce((acc, name) => ({ ...acc, [name]: true }), {})
        );

        const hasErrors = Object.values(nextErrors).some(Boolean);
        if (hasErrors) return;

        setStatus("saving");
        // Simulate an async save — replace with your API call.
        setTimeout(() => {
            setStatus("saved");
            setValues((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
        }, 900);
    }

    const strength = passwordStrength(values.newPassword);

    function fieldClasses(name) {
        const hasError = touched[name] && errors[name];
        return [
            "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
            "focus:ring-2 focus:ring-offset-0",
            hasError
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100",
        ].join(" ");
    }

    return (
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Account settings</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Update your profile details and password.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Profile section */}
                <fieldset className="space-y-4">
                    <legend className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Profile
                    </legend>

                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Jordan Rivera"
                            className={fieldClasses("name")}
                            aria-invalid={Boolean(touched.name && errors.name)}
                            aria-describedby="name-error"
                        />
                        {touched.name && errors.name && (
                            <p id="name-error" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="jordan@example.com"
                            className={fieldClasses("email")}
                            aria-invalid={Boolean(touched.email && errors.email)}
                            aria-describedby="email-error"
                        />
                        {touched.email && errors.email && (
                            <p id="email-error" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="jrivera"
                            className={fieldClasses("username")}
                            aria-invalid={Boolean(touched.username && errors.username)}
                            aria-describedby="username-error"
                        />
                        {touched.username && errors.username && (
                            <p id="username-error" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" /> {errors.username}
                            </p>
                        )}
                    </div>
                </fieldset>

                {/* Password section */}
                <fieldset className="space-y-4 border-t border-slate-100 pt-5">
                    <legend className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Change password
                    </legend>
                    <p className="-mt-2 text-xs text-slate-400">Leave blank to keep your current password.</p>

                    <div>
                        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-slate-700">
                            New password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPw ? "text" : "password"}
                                value={values.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••"
                                className={fieldClasses("newPassword") + " pr-10"}
                                aria-invalid={Boolean(touched.newPassword && errors.newPassword)}
                                aria-describedby="newPassword-error"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label={showPw ? "Hide password" : "Show password"}
                            >
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {values.newPassword && (
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${
                                                i < strength ? STRENGTH_COLORS[strength - 1] : "bg-slate-100"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    {STRENGTH_LABELS[Math.max(strength - 1, 0)]}
                                </p>
                            </div>
                        )}

                        {touched.newPassword && errors.newPassword && (
                            <p id="newPassword-error" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" /> {errors.newPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
                            Confirm new password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPw ? "text" : "password"}
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••"
                                className={fieldClasses("confirmPassword") + " pr-10"}
                                aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                aria-describedby="confirmPassword-error"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPw((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label={showConfirmPw ? "Hide password" : "Show password"}
                            >
                                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {touched.confirmPassword && errors.confirmPassword && (
                            <p id="confirmPassword-error" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" /> {errors.confirmPassword}
                            </p>
                        )}
                    </div>
                </fieldset>

                {/* Notifications section */}
                <fieldset className="space-y-3 border-t border-slate-100 pt-5">
                    <legend className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Notifications
                    </legend>

                    <label className="flex items-center justify-between gap-4 text-sm text-slate-700">
            <span>
              Email notifications
              <span className="block text-xs text-slate-400">Get emailed about account activity.</span>
            </span>
                        <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={values.emailNotifications}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                        />
                    </label>

                    <label className="flex items-center justify-between gap-4 text-sm text-slate-700">
            <span>
              Product updates
              <span className="block text-xs text-slate-400">Occasional news about new features.</span>
            </span>
                        <input
                            type="checkbox"
                            name="productUpdates"
                            checked={values.productUpdates}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                        />
                    </label>
                </fieldset>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
                        {status === "saving" ? "Saving..." : "Save changes"}
                    </button>

                    {status === "saved" && (
                        <span className="flex items-center gap-1 text-sm text-emerald-600">
              <Check className="h-4 w-4" /> Saved
            </span>
                    )}
                </div>
            </form>
        </div>
    );
}