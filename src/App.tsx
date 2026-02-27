import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ItemList from './components/Lists/ItemList';
import './App.css';

/**
 * App root.
 * <Authenticator> handles the entire auth flow:
 *   - Sign Up (with email verification)
 *   - Sign In
 *   - Forgot Password
 * Children only render when the user is authenticated.
 */
export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app">
          <header className="app-header">
            <h1>📋 My App</h1>
            <div className="user-info">
              <span>{user?.signInDetails?.loginId}</span>
              <button onClick={signOut} className="sign-out-btn">
                Sign Out
              </button>
            </div>
          </header>

          <main className="app-main">
            <ItemList />
          </main>
        </div>
      )}
    </Authenticator>
  );
}
