// sign in page
import { signUp } from "aws-amplify/auth";
import { useState } from 'react';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // add: sign up logic
        setError('');
        setMessage('');
        if (!agreedToTerms){
            setError('You must agree to the terms to create an account.');
            return;
        }

        try{
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes:{
                        email,
                    },
                },
            });
            window.location.href = "/confirm-signup";   
        } catch(err){
            setError(err.message);
        }
        console.log('Sign up submitted:', { email, password, agreedToTerms });
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT SIDE - image section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src="assets/images/left-mealpic.png"   // make sure correct pic
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
                                src="assets/images/nourishlylogonoears.png"   // make sure correct pic
                                alt="Nourishly icon"
                                className="w-12 h-12 mr-3"
                            />
                            <h1 className="text-4xl font-semibold text-[#6B8E6F]">
                                Nourishly
                            </h1>
                        </div>

                        {/* title */}
                        <h2 className="text-2xl font-medium text-[#6B8E6F] text-center mb-8">
                            Create an account
                        </h2>

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
                                    />

                                    {/* toggle password visibility */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >

                                        {showPassword ? (
                                            // eye icon (visible)
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            // eye-slash icon (hidden)
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* submit button */}
                            <button
                                type="submit"
                                className="w-full bg-[#6B8E6F] text-white py-3 rounded-lg font-medium hover:bg-[#5a7a5e] transition duration-200"
                            >
                                Create an account
                            </button>

                            {/* terms checkbox */}
                            <div className="flex items-start gap-3">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-[#6B8E6F] bg-gray-100 border-gray-300 rounded focus:ring-[#6B8E6F]"
                                    required
                                />

                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    By creating an account, I agree to our{' '}
                                    <a href="#" className="text-[#6B8E6F] hover:underline">
                                        Terms of Use
                                    </a>
                                    {' '}and{' '}
                                    <a href="#" className="text-[#6B8E6F] hover:underline">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>
                        </form>

                        {/* footer */}
                        <div className="mt-8 text-center text-xs text-gray-500">
                            © Nourishly 2025 •
                            <a href="#" className="hover:text-[#6B8E6F] ml-1">Privacy</a> •
                            <a href="#" className="hover:text-[#6B8E6F] ml-1">Terms</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;