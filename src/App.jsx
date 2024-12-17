import { useEffect, useState } from 'react'
import TaskLists from './components/TaskLists';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { SignOut } from './components/SignOut';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return unsubscribe
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <TaskLists user={user} /> : <SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path=" /signout" element={<SignOut />} />
      </Routes>
    </Router>
  )
}

export default App
