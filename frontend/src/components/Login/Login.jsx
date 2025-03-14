import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Logging with: ", email, password);
        const userData = {email, password};

        try{
            const response = await fetch('http://localhost:9000/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if(response.ok){
                localStorage.setItem('token', data.token);
                localStorage.setItem('loggedIn', 'true');
                window.dispatchEvent(new Event('storage'));
                navigate('/event');
                toast.success(`Login successful!!`);
            }   
            else {
                if (data.error === "Email not registered") {
                    toast.error("Your email is not registered.");
                } 
                else if (data.error === "Invalid credentials") {
                    toast.error("Email and password combination is not correct.");
                } 
                else {
                    toast.error("An unexpected error occurred. Please try again later.");
                }
            }
        }
        catch (err){
            toast.error("Failed to login", err);
        }
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