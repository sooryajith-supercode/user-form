'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const router = useRouter();  

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/login', data);
      if (res.status === 200) {
        setMessage('Login successful!');
        
        // Store the token in localStorage
        localStorage.setItem('token', res.data.token);
  
        // Redirect to the dashboard page
        router.push('/dashboard');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register('username', { required: true })} />
          {errors.username && <span>Username is required</span>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: true })} />
          {errors.password && <span>Password is required</span>}
        </div>

        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
