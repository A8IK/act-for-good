import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging with: ", email, password);
        alert("Login Successful!!");
        navigate('/')

    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">
                        Come make the world beautiful together. All together we are invincible. Everyone has a power that makes someone happy.<br /> Spread your hands. Not Hates.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={handleLogin} className="fieldset">
                            <label className="fieldset-label">Email</label>
                            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            <label className="fieldset-label">Password</label>
                            <input type="password" className="input" vlaue={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            <div><a href='/' className="link link-hover">Don't have an account? Sign Up</a></div>
                            <button type='submit' className="btn btn-neutral mt-4">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;