// log in page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login, error: authError, clearError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        clearError();

        // Basic validation
        if (!email || !password) {
            setFormError("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFormError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        const result = await login(email, password);

        setIsSubmitting(false);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setFormError(result.error || "Login failed. Please try again.");
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log("Google login clicked");
    };

    const handleFacebookLogin = () => {
        // TODO: Implement Facebook OAuth
        console.log("Facebook login clicked");
    };

    const displayError = formError || authError;

    return (
        <div className="min-h-screen flex">
            {/* LEFT SIDE - image section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src="assets/images/left-mealpic.png"
                    alt="Left meal plan"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* RIGHT SIDE - form section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#E8E3D8] px-8">
                <div className="w-full max-w-md">
                    {/* card container */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12">
                        {/* logo section */}
                        <div className="flex items-center justify-center mb-8">
                            <img
                                src="assets/images/nourishlylogonoears.png"
                                alt="Nourishly icon"
                                className="w-12 h-12 mr-3"
                            />
                            <h1 className="text-4xl font-semibold text-[#6B8E6F]">
                                Nourishly
                            </h1>
                        </div>

                        {/* title */}
                        <h2 className="text-2xl font-medium text-[#6B8E6F] text-center mb-8">
                            Log in
                        </h2>

                        {/* error message */}
                        {displayError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {displayError}
                            </div>
                        )}

                        {/* form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* email field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-[#6B8E6F] mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] transition"
                                    placeholder="Enter your email"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* password field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-[#6B8E6F] mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] transition pr-12"
                                        placeholder="Enter your password"
                                        required
                                        disabled={isSubmitting}
                                    />
                                    {/* toggle password visibility */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            // eye icon (visible)
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        ) : (
                                            // eye-slash icon (hidden)
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* forgot password link */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-gray-500 hover:text-[#6B8E6F] transition"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {/* submit button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#6B8E6F] text-white py-3 rounded-lg font-medium hover:bg-[#5a7a5e] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Logging in..." : "Log in"}
                            </button>
                        </form>

                        {/* OR divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">OR</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* social login buttons */}
                        <div className="space-y-3">
                            {/* Google button */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isSubmitting}
                                className="w-full bg-[#E8E3D8] text-gray-700 py-3 rounded-lg font-medium hover:bg-[#ddd8cd] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                            {/* Facebook Button */}
                            <button
                                type="button"
                                onClick={handleFacebookLogin}
                                disabled={isSubmitting}
                                className="w-full bg-[#E8E3D8] text-gray-700 py-3 rounded-lg font-medium hover:bg-[#ddd8cd] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {/* Facebook icon */}
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Continue with Facebook
                            </button>
                        </div>

                        {/* sign up link */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account yet?{" "}
                            <Link
                                to="/signup"
                                className="text-[#6B8E6F] font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </div>

                        {/* footer */}
                        <div className="mt-8 text-center text-xs text-gray-500">
                            © Nourishly 2025 •
                            <a href="#" className="hover:text-[#6B8E6F] ml-1">
                                Privacy
                            </a>{" "}
                            •
                            <a href="#" className="hover:text-[#6B8E6F] ml-1">
                                Terms
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;