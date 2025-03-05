import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/apiService';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [supportType, setSupportType] = useState('');
    const [error, setError] = useState('');

    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const userData = { name, email, password, contact, supportType};
            const response = await signup(userData);
            navigate('/homePage');

            alert('Signup successfully');

        }
        catch(err) {
            setError(err.message);
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
       
        <div className="mt-4 text-center">
          <a href="/signin" className="text-blue-500">Already have an account? Sign In</a>
        </div>
      </div>
    </div>
    );
};

export default SignUp;