import { signIn } from "aws-amplify/auth";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { useAuth } from '../context/useAuth';

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

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    const redirectTo = location.state?.from?.pathname || '/dashboard';
    const resetSuccessMessage = location.state?.resetSuccess || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await signIn({
                username: email,
                password,
            });

            if (result.isSignedIn) {
                setUser({ username: email });
                navigate(redirectTo, { replace: true });
                return;
            }

            setError('Additional sign-in steps are required for this account.');
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        setError('Google sign-in is not available yet.');
    };

    const handleFacebookLogin = () => {
        setError('Facebook sign-in is not available yet.');
    };

    return (
        <AuthPageLayout>
            <div className="w-full rounded-3xl border border-white/70 bg-card p-5 shadow-sm sm:p-8 lg:p-10">
                <div className="mb-6 text-center sm:mb-8">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                        Welcome back
                    </p>
                    <h2 className="text-3xl font-bold text-primaryDark sm:text-4xl">
                        Log in
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Continue planning meals and building your grocery list.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {resetSuccessMessage && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            {resetSuccessMessage}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-primaryDark">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-subtle px-4 py-3 text-primaryDark transition placeholder:text-muted/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-primaryDark">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-subtle px-4 py-3 pr-12 text-primaryDark transition placeholder:text-muted/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primaryDark"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    email
                                        ? `/forgot-password?email=${encodeURIComponent(email)}`
                                        : '/forgot-password'
                                )
                            }
                            className="text-sm font-semibold text-primary transition hover:text-primaryDark"
                        >
                            Forgot your password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-primary py-3 font-bold text-white shadow-sm transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <div className="my-5 flex items-center sm:my-6">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="px-4 text-xs font-semibold uppercase tracking-wide text-muted">or</span>
                    <div className="flex-1 border-t border-gray-200" />
                </div>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 font-semibold text-primaryDark transition hover:bg-subtle"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        type="button"
                        onClick={handleFacebookLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 font-semibold text-primaryDark transition hover:bg-subtle"
                    >
                        <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Continue with Facebook
                    </button>
                </div>

                <div className="mt-5 text-center sm:mt-6 text-sm text-muted">
                    Don&apos;t have an account yet?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="font-bold text-primary transition hover:text-primaryDark"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </AuthPageLayout>
    );
}

export default LogIn;
