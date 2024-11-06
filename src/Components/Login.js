  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from './firebase'; // Ensure Firebase is configured properly
  import './Login.css'; // Import the CSS file

  function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const evaluatorEmails = {
      'charles.coscos@greenergy.com': 'charles',
      'caryl.apa@greenergy.com': 'caryl',
      'patrick.paclibar@greenergy.com': 'patrick',
      'vincent.go@greenergy.com': 'vincent',
      'jayr@greenergy.com': 'jayr',
      'rodel.bartolata@greenergy.com': 'rodel',
      'tristan@greenergy.com': 'tristan',
    };

    const adminEmails = ['admin@greenergy.ph'];
    const requesterEmails = ['requester@greenergy.ph'];

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage('');
      setLoading(true);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (evaluatorEmails[user.email]) {
          const evaluatorId = evaluatorEmails[user.email];
          navigate(`/dashboard/evaluator/${evaluatorId}`);
        } else if (adminEmails.includes(user.email)) {
          navigate('/dashboard/admin');
        } else if (requesterEmails.includes(user.email)) {
          navigate('/dashboard/requester');
        } else {
          setErrorMessage('You are not authorized to access this section.');
        }
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect password. Please try again.');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMessage('No user found with this email.');
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email format.');
        } else {
          setErrorMessage('Login failed. Please try again later.');
        }
      }

      setLoading(false);
    };

    return (
      <div className="login-page-container">
        <div className="login-page-box">
          <h2 className="login-page-title">Login</h2>
          <form onSubmit={handleSubmit} className="login-page-form">
            <div className="login-page-input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-page-input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-page-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {errorMessage && <p className="login-page-error-message">{errorMessage}</p>}
        </div>
      </div>
    );
  }

  export default Login;
