import { createContext, useState } from "react";

export const RecoveryContext = createContext();

export const RecoveryProvider = ({ children }) => {
   const [email, setEmail] = useState("khansa88013@gmail.com");
  const [OTP, setOTP] = useState();
    const [Username, setusername] = useState(null);
    const [Role,setrole]=useState(null)
     const [emailVerified, setEmailVerified] = useState(false); // step 1
  const [otpVerified, setOtpVerified] = useState(false);     // step 2
  const [passwordChanged, setPasswordChanged] = useState(false); // step 3

  return (
    <RecoveryContext.Provider value={{ email,setEmail, OTP, setOTP ,Username,setusername,Role,setrole,
        emailVerified,
        setEmailVerified,
        otpVerified,
        setOtpVerified,
        passwordChanged,
        setPasswordChanged,
    }}>
      {children}
    </RecoveryContext.Provider>
  );
};
