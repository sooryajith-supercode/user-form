'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 


export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/register', data);  

      if (res.status === 201) {
        setMessage('Registration successful!');
        setTimeout(() => {
          router.push('/login');  
        }, 1000);
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // Check if the error response has a specific status code
        if (err.response.status === 409) {
          setMessage('User already exists. Please try a different username.');
        } else {
          setMessage(err.response.data.message || 'Registration failed. Please try again.');
        }
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
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

        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
