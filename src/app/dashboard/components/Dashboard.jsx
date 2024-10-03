'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
      // Check if the token exists in localStorage
      const token = localStorage.getItem('token');
  
      // If no token, redirect to login
      if (!token) {
        router.push('/login');
      }
    }, []);
  
    return (
      <div>
        <h1>Dashboard</h1>
        {/* Protected content for authenticated users */}
      </div>
    );
}
