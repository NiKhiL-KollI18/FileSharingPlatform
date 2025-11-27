import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/SignIn.css';
import { signup, login } from '../api';
import userBack1 from '../assets/bg1.jpg';

const SignIn = ({ onSignIn }) => {
    const [showConfirmGuest, setShowConfirmGuest] = useState(false);
    const [showPopup, setShowPopup] = useState('signin');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    // LOGIN
    const handleSignIn = async () => {
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        try {
            const response = await login({ email, password });

            // CHECK FOR SUCCESS AND TOKEN
            if (response?.status === 'success' && response?.token) {
                // Pass both the email AND the token up to App.jsx
                onSignIn({ email }, response.token);
                navigate('/dashboard');
            } else {
                alert(response?.message || 'Signin failed!');
            }
        } catch (err) {
            alert('Error logging in: ' + err.message);
        }
    };

    // SIGNUP
    const handleRegistration = async () => {
        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill out all fields.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            const response = await signup({ name: username, email, password }); // Changed 'username' to 'name' to match UserEntity
            if (response?.status === 'success') {
                alert('Registration successful! Please log in.');
                setShowPopup('signin');
            } else {
                alert(response?.message || 'Signup failed!');
            }
        } catch (err) {
            alert('Error signing up: ' + err.message);
        }
    };

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-left" style={{ backgroundImage: `url(${userBack1})` }}>
                    <div className="auth-left-overlay"></div>
                </div>
                <div className="auth-right">
                    <div id="Container">
                        <div id="popup" className="show">
                            <div id="popupWindow">
                                <div id="popupheader">
                                    <div className="google"><i className="fa-brands fa-google"></i></div>
                                    <div className="facebook"><i className="fa-brands fa-facebook"></i></div>
                                    <div className="twitter"><i className="fa-brands fa-twitter"></i></div>
                                    <div className="linkedin"><i className="fa-brands fa-linkedin"></i></div>
                                    <div className="apple"><i className="fa-brands fa-apple"></i></div>
                                </div>
                                <div id="popupcontainer">
                                    <div className="popupdivider"></div>
                                    <div id="popupdivider2">Or</div>
                                    <div className="popupdivider"></div>
                                </div>

                                {showPopup === 'signin' && (
                                    <div id="signin">
                                        <label className="emaillable">Email</label>
                                        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label className="passwordlable">Password</label>
                                        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <button className="signinbutton" onClick={handleSignIn}>Sign In</button>
                                        <div className="div2">
                                            Don&apos;t have an account? <label onClick={() => setShowPopup('signup')}>Sign Up Now</label>
                                        </div>
                                        <div className="div4">
                                            <button className="guestbutton" onClick={() => setShowConfirmGuest(true)}>
                                                <i className="fa-regular fa-user"></i> Guest User
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {showPopup === 'signup' && (
                                    <div id="signup">
                                        <label className="usernamelable">User Name</label>
                                        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        <label className="emaillable">Email</label>
                                        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label className="passwordlable">Password</label>
                                        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <label className="passwordlable">Confirm Password</label>
                                        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        <button className="signinbutton" onClick={handleRegistration}>Register</button>
                                        <div className="div2">
                                            Already have an account? <label onClick={() => setShowPopup('signin')}>Sign In</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmGuest && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p>Guest mode is read-only. Continue?</p>
                        <div className="confirm-buttons">
                            <button onClick={() => { onSignIn({ username: 'Guest' }, null); navigate('/dashboard'); }}>Yes</button>
                            <button onClick={() => setShowConfirmGuest(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

SignIn.propTypes = {
    onSignIn: PropTypes.func.isRequired,
};

export default SignIn;