import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const EmailSentPage = () => {
  const location = useLocation();
  const { email } = location.state || { email: '' };

  const maskedEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white px-4">
      <div className="max-w-md w-full bg-black/70 rounded-lg p-8 space-y-6 text-center shadow-md">
      <form className="bg-white p-6 rounded space-y-4 w-full max-w-sm">

      <h1 className="text-3xl font-bold mb-2 text-black">📧 Email Sent</h1>
        <p className="text-black">
          An email with instructions on how to reset your password has been sent to
          <br />
          <span className="font-semibold text-black">{maskedEmail(email)}</span>.
        </p>
        <p className="text-black mt-4">
          Check your spam or junk folder if you don’t see the email in your inbox.
        </p>
        <p className="text-black mt-2">
          If you no longer have access to this email account, please{' '}
          <Link to="/contact" className="text-blue-400 underline hover:text-blue-500">
            contact us
          </Link>.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md"
        >
          Return to Home
        </Link>

      </form>
      <div>
        <p>This page is protected by Google reCAPTCHA to ensure you're not a bot.</p>
      </div>
      
       
      </div>
    </div>
  );
};

export default EmailSentPage;
