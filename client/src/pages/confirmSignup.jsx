import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      setMessage("Account verified! You can now log in.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  const resendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      setMessage("A new verification code was sent.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E3D8]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-center text-[#6B8E6F] mb-6">
          Verify Your Account
        </h2>

        {email ? (
          <p className="mb-4 text-center text-sm text-gray-600">
            Verification code sent to <span className="font-medium">{email}</span>
          </p>
        ) : (
          <p className="mb-4 text-center text-sm text-red-600">
            We could not determine your email. Please go back to sign up and try again.
          </p>
        )}

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        {message && <div className="text-green-600 text-sm mb-3">{message}</div>}

        <form onSubmit={handleConfirm} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e)=>setCode(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded"
            required
          />

          <button
            disabled={!email}
            className="w-full bg-[#6B8E6F] text-white py-3 rounded disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirm Account
          </button>
        </form>

        <button
          type="button"
          onClick={resendCode}
          disabled={!email}
          className="text-sm text-[#6B8E6F] mt-4 underline"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
