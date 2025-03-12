import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/apiService';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [supportType, setSupportType] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const userData = { name, email, password, contact, supportType};
            const response = await signup(userData);
            navigate('/login');

            alert('Signup successfully');

        }
        catch(err) {
            setError(err.message);
        }
    }
    return (
        <div className="min-h-screen bg-gray-600 flex items-center justify-center">
      <div className="bg-slate-500 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Fullname</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact No.</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
          <label className="block text-gray-700">Support Type</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-accent-content"
              value={supportType}
              onChange={(e) => setSupportType(e.target.value)}
              required
            >
              <option value="" disabled>Select Support Type</option>
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
              <option value="organization">Organization</option>
              <option value="environmental">Environmental</option>
              <option value="healthcare">Healthcare</option>
              <option value="others">Others</option>
            </select>
          </div>
          <button className="btn btn-block hover:bg-gray-100 hover:text-black transition duration-300 text-amber-50" type="submit">Sign Up</button>
        </form>
       
        <div className="mt-4 text-center">
          <Link to="/login" className="text-emerald-100 hover:to-black">Already have an account? Sign In</Link>
        </div>
      </div>
    </div>
    );
};

export default SignUp;