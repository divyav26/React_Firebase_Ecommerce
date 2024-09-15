import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { auth, db } from '@/firebase/FirebaseConfig';
import { showErrorToast, showSuccessToast } from '@/commanComponents/CommanToast';
import Layout from '../layout/Layout';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting to sign in...");

      // Sign in the user with Firebase Auth
      const userData = await signInWithEmailAndPassword(auth, email, password);
      const user = userData.user;
      console.log("User signed in:", user);

      // Fetch user data from Firestore using user.uid
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data from Firestore:", userData);

        // Check if the user has the isAdmin field
        const isAdmin = userData.isAdmin === true;
        const name = userData.name || ''; // get name from firebase 
        navigate("/admin/dashboard/AdminDashboard");
        // console.log("Is Admin: ", isAdmin);

        // Store user data in cookies
        Cookies.set("user", JSON.stringify({name, email: user.email, isAdmin }));
        console.log("User data stored in cookies");

        // Get user token
        const userToken = await user.getIdToken();
        console.log("User token:", userToken);
        Cookies.set("user_token", userToken);
        Cookies.set("user_id", user.uid);

        // Navigate based on user role
        if (isAdmin) {
          // console.log("Navigating to /admin/dashboard");
          navigate("/admin/dashboard/Home");
          showSuccessToast('Login successful!');
        } else {
          // console.log("Navigating to /");
          navigate("/");
          showSuccessToast('Login successful!');
        }

       
      } else {
        console.error("User document not found in Firestore.");
        throw new Error("User data not found.");
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      showErrorToast(`Login failed. ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-10 h-[79vh] overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
