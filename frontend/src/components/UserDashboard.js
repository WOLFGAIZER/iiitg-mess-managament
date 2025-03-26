import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt="User Profile" width="50" />
          <button onClick={() => signOut(auth)}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
};

export default UserDashboard;
