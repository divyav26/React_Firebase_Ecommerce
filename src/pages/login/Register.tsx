import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/firebase/FirebaseConfig'; // Import Firestore
import { showErrorToast, showSuccessToast } from '@/commanComponents/CommanToast';
import Layout from '../layout/Layout';
import { Input } from '@/components/ui/input';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showErrorToast('Passwords do not match.');
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // console.log('User created:', user);

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        isAdmin: false, // Default value for isAdmin, change if needed
        createdAt: new Date(), // Store the timestamp of user creation
      });
      // console.log('User data stored in Firestore');
      showSuccessToast('Registration successfully completed!!!');
      navigate('/login');
    } catch (error) {
      // console.error("Error registering user:", error);
      showErrorToast('Registration failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-10 h-[79vh] overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
