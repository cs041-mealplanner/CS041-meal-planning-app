import { confirmResetPassword, resetPassword } from "aws-amplify/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";

const PASSWORD_MIN_LENGTH = 8;

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
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-gray-600"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-lg bg-[#F5F5F5] px-4 py-3 pr-12 transition focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                    placeholder={placeholder}
                    required
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    )}
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
            <div className="w-full rounded-3xl bg-white p-8 shadow-lg lg:p-10">
                <h2 className="mb-3 text-center text-3xl font-bold text-[#6B8E6F]">
                    Forgot Password
                </h2>

                <p className="mb-6 text-center text-sm text-gray-600">
                    {step === "request"
                        ? "Enter your email and we'll send you a verification code."
                        : "Enter the confirmation code from your email and choose a new password."}
                </p>

                <div className="mb-8 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "request" ? "bg-[#6B8E6F] text-white" : "bg-[#DDE8DE] text-[#6B8E6F]"}`}>
                            1
                        </span>
                        <span className="text-gray-600">Email</span>
                    </div>

                    <div className="h-px w-10 bg-gray-300" />

                    <div className="flex items-center gap-2">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "confirm" ? "bg-[#6B8E6F] text-white" : "bg-[#F0F0F0] text-gray-500"}`}>
                            2
                        </span>
                        <span className="text-gray-600">Reset</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {step === "request" ? (
                    <form onSubmit={handleRequestReset} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-600"
                            >
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
                                className="w-full rounded-lg bg-[#F5F5F5] px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-[#6B8E6F] py-3 font-medium text-white transition duration-200 hover:bg-[#5a7a5e] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Sending code..." : "Send Reset Code"}
                        </button>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleConfirmReset} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="code"
                                    className="mb-2 block text-sm font-medium text-gray-600"
                                >
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
                                    className="w-full rounded-lg bg-[#F5F5F5] px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
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
                                className="w-full rounded-lg bg-[#6B8E6F] py-3 font-medium text-white transition duration-200 hover:bg-[#5a7a5e] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "Resetting password..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isSubmitting}
                                className="text-[#6B8E6F] transition hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Resend code
                            </button>

                            <button
                                type="button"
                                onClick={handleUseDifferentEmail}
                                disabled={isSubmitting}
                                className="text-gray-500 transition hover:text-[#6B8E6F] disabled:cursor-not-allowed disabled:opacity-60"
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
                        className="text-sm text-gray-500 transition hover:text-[#6B8E6F]"
                    >
                        Back to Log in
                    </button>
                </div>
            </div>
        </AuthPageLayout>
    );
}
