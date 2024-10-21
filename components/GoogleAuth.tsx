// components/GoogleAuth.tsx
import { GoogleLogin } from '@react-oauth/google';

interface GoogleAuthProps {
  onSuccess: (credentialResponse: any) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
};

export default GoogleAuth;
