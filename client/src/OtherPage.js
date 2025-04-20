import React from 'react';
import { Link } from 'react-router-dom';

export default function OtherPage() { 
    return (
        <div>
        <h1>Other Page</h1>
        <p>This is another page in the application.</p>
        <Link to="/">Go back to Home</Link>
        </div>
    );
}