import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";

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
    <AuthPageLayout showImage={false}>
      <div className="w-full rounded-3xl bg-white p-8 shadow-lg lg:p-10">
        <h2 className="mb-6 text-center text-3xl font-bold text-[#6B8E6F]">
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

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-3 text-sm text-green-600">{message}</div>}

        <form onSubmit={handleConfirm} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg bg-[#F5F5F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
            required
          />

          <button
            type="submit"
            disabled={!email}
            className="w-full rounded-lg bg-[#6B8E6F] py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirm Account
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={resendCode}
            disabled={!email}
            className="text-sm text-[#6B8E6F] underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Resend code
          </button>
        </div>
      </div>
    </AuthPageLayout>
  );
}
