import { confirmResetPassword, resetPassword } from "aws-amplify/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";

const PASSWORD_MIN_LENGTH = 8;

function EyeIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeSlashIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    placeholder,
    show,
    onToggle,
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primaryDark">
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-gray-200 bg-subtle px-4 py-3 pr-12 text-primaryDark transition placeholder:text-muted/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={placeholder}
                    required
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primaryDark"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
            </div>
        </div>
    );
}

export default function ForgotPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState("request");
    const [deliveryHint, setDeliveryHint] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const normalizedEmail = email.trim();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsSubmitting(true);

        try {
            const result = await resetPassword({ username: normalizedEmail });
            const { nextStep } = result;

            if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
                const destination = nextStep.codeDeliveryDetails?.destination;
                const medium = nextStep.codeDeliveryDetails?.deliveryMedium?.toLowerCase();

                setDeliveryHint(destination || "");
                setStep("confirm");
                setMessage(
                    destination
                        ? `We sent a reset code to your ${medium || "account"} at ${destination}.`
                        : "We sent a reset code to your account email."
                );
                return;
            }

            setMessage("Your password reset is already complete. You can log in now.");
        } catch (err) {
            setError(err.message || "We couldn't start the reset process. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < PASSWORD_MIN_LENGTH) {
            setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
            return;
        }

        setIsSubmitting(true);

        try {
            await confirmResetPassword({
                username: normalizedEmail,
                confirmationCode: code.trim(),
                newPassword,
            });

            navigate("/login", {
                replace: true,
                state: {
                    resetSuccess: "Password updated. Please log in with your new password.",
                },
            });
        } catch (err) {
            setError(err.message || "We couldn't reset your password. Please check the code and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        setError("");
        setMessage("");
        setIsSubmitting(true);

        try {
            const result = await resetPassword({ username: normalizedEmail });
            const destination = result.nextStep.codeDeliveryDetails?.destination;
            setDeliveryHint(destination || deliveryHint);
            setMessage(
                destination
                    ? `A new reset code was sent to ${destination}.`
                    : "A new reset code was sent."
            );
        } catch (err) {
            setError(err.message || "We couldn't resend the reset code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUseDifferentEmail = () => {
        setStep("request");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setDeliveryHint("");
        setMessage("");
        setError("");
    };

    return (
        <AuthPageLayout>
            <div className="w-full rounded-3xl border border-white/70 bg-card p-5 shadow-sm sm:p-8 lg:p-10">
                <div className="mb-6 text-center sm:mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                        Account recovery
                    </p>
                    <h2 className="text-3xl font-bold text-primaryDark sm:text-4xl">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        {step === "request"
                            ? "Enter your email and we'll send you a verification code."
                            : "Enter the code from your email and choose a new password."}
                    </p>
                </div>

                <div className="mb-8 rounded-2xl bg-subtle p-4">
                    <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "request" ? "bg-primary text-white" : "bg-card text-primary"}`}>
                                1
                            </span>
                            <span className="text-muted">Email</span>
                        </div>

                        <div className="h-px w-10 bg-gray-200" />

                        <div className="flex items-center gap-2">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "confirm" ? "bg-primary text-white" : "bg-card text-muted"}`}>
                                2
                            </span>
                            <span className="text-muted">Reset</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {message}
                    </div>
                )}

                {step === "request" ? (
                    <form onSubmit={handleRequestReset} className="space-y-4 sm:space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-primaryDark">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-subtle px-4 py-3 text-primaryDark transition placeholder:text-muted/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-primary py-3 font-bold text-white shadow-sm transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Sending code..." : "Send Reset Code"}
                        </button>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleConfirmReset} className="space-y-4 sm:space-y-5">
                            <div>
                                <label htmlFor="code" className="mb-2 block text-sm font-semibold text-primaryDark">
                                    Confirmation Code
                                </label>

                                <input
                                    id="code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full rounded-2xl border border-gray-200 bg-subtle px-4 py-3 text-primaryDark transition placeholder:text-muted/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter the 6-digit code"
                                    required
                                />
                            </div>

                            <PasswordField
                                id="newPassword"
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter new password"
                                show={showNewPassword}
                                onToggle={() => setShowNewPassword((value) => !value)}
                            />

                            <PasswordField
                                id="confirmPassword"
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Confirm new password"
                                show={showConfirmPassword}
                                onToggle={() => setShowConfirmPassword((value) => !value)}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-primary py-3 font-bold text-white shadow-sm transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "Resetting password..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isSubmitting}
                                className="font-semibold text-primary transition hover:text-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Resend code
                            </button>

                            <button
                                type="button"
                                onClick={handleUseDifferentEmail}
                                disabled={isSubmitting}
                                className="font-semibold text-muted transition hover:text-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Use a different email
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm font-semibold text-primary transition hover:text-primaryDark"
                    >
                        Back to Log in
                    </button>
                </div>
            </div>
        </AuthPageLayout>
    );
}
