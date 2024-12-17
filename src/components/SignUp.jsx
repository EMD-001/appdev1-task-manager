import React, { useState } from 'react'
import { Link } from 'react-router'
import { auth } from '../firebase'
import { useNavigate } from 'react-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
   
    const navigate = useNavigate()

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (error) {
            setError(`Failed to signup: ${error}`)
        }
    }
    

    return (
        <div>
            <h2>Sign Up</h2>
            <input type="email" placeholder='email...' onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='password ...' onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignUp}>Sign Up</button>
            {error && <p>{error}</p>}
            <p>Already have an account? <Link to="/signin">Login</Link></p>
        </div>
  )
}