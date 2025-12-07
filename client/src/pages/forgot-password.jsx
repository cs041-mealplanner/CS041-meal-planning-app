// forgot password page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SetNewPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // check if passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // check password length (optional validation) might set more
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        //  add password reset logic (API call later)
        console.log('New password set:', newPassword);

        // after successful reset, go back to login
        navigate('/login');
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
                        <h2 className="text-2xl font-medium text-[#6B8E6F] text-center mb-6">
                            Set New Password
                        </h2>

                        {/* shield icon */}
                        <div className="flex justify-center mb-8">
                            <svg className="w-20 h-20 text-[#6B8E6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        {/* error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* form */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* new password field */}
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-600 mb-2"
                                >
                                    New password
                                </label>

                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setError(''); // clear error when typing
                                        }}

                                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] transition pr-12"
                                        placeholder="Enter new password"
                                        required
                                    />

                                    {/* toggle password visibility */}
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* confirm password field */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-600 mb-2"
                                >
                                    Confirm new password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setError(''); // clear error when typing
                                        }}
                                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] transition pr-12"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    {/* toggle password visibility */}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
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
                                Confirm
                            </button>

                        </form>

                        {/* back to login Link */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/login')} // make sure route to login page
                                className="text-sm text-gray-500 hover:text-[#6B8E6F] transition"
                            >
                                Back to Log in
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetNewPassword;