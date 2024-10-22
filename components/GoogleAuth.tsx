// components/GoogleAuth.tsx
import { GoogleLogin } from '@react-oauth/google';

// Define the props interface for the GoogleAuth component
interface GoogleAuthProps {
  onSuccess: (credentialResponse: any) => void;  // Callback function to handle successful authentication
}

/**
 * GoogleAuth Component
 * 
 * This component renders a Google Login button using the @react-oauth/google library.
 * It allows users to authenticate with their Google account.
 *
 * @param {Function} onSuccess - Callback function that is called when Google authentication is successful.
 *                               It receives the credential response from Google.
 */
const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess }) => {
  return (
    <GoogleLogin
      // onSuccess prop: Called when Google authentication is successful
      onSuccess={onSuccess}
      
      // onError prop: Called when Google authentication fails
      onError={() => {
        console.log('Login Failed');
        // Note: In a production environment, you might want to handle this error more gracefully,
        // such as displaying an error message to the user or triggering an error reporting service.
      }}
    />
  );
};

// Export the GoogleAuth component as the default export
export default GoogleAuth;
