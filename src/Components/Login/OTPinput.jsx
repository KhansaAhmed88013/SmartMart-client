import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { RecoveryContext } from "../../Context/RecoveryContext";

function OTPinput() {
  const [inputotp, setinputOtp] = useState(["", "", "", "", ""]);
  const { email, OTP ,setOTP,emailVerified,setOtpVerified}=useContext(RecoveryContext)
  const [timer,setTimer]=useState(60)
  const [disable,setDisable]=useState(true)
  const [error,setError]=useState(null)
  const navigate=useNavigate()
  useEffect(() => {
    if (!emailVerified) {
      navigate("/recovery/Recovery-Info");
    }
  }, [emailVerified]);

 useEffect(() => {
  if (!disable) return; // don't start timer if not disabled

  const interval = setInterval(() => {
    setTimer((lastTimerCount) => {
      if (lastTimerCount <= 1) {
        clearInterval(interval);
        setDisable(false);
        return 0;
      }
      return lastTimerCount - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [disable]);

  const VerifyOTP=()=>{
   if(parseInt(inputotp.join(""))===OTP){
          setOtpVerified(true); // mark step 2 complete
    navigate('/recovery/Recovered')
    return;
   }
   alert("The code you have entered is not correct. Try again or re-send the link")
   return;
  }
  const ResendOTP=async()=>{
    if(disable)return
    try {
      const RandomOTP = Math.floor(Math.random() * 90000 + 10000);
      setOTP(RandomOTP);
      
      const response = await fetch("/send_recovery_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_email:email, OTP:RandomOTP }),
      });

      const data = await response.json();

      if (data.success) {
       setDisable(true)
       alert(`A new OTP has successfully sent to your email ${email}`)
       setTimer(60)
      } else {
        setError(data.message || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending OTP. Try again later.");
    }
  }

  // Handle OTP input
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...inputotp];
    newOtp[index] = element.value;
    setinputOtp(newOtp);

    // Auto focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };


  return (
    <div className="login-container">
      {/* Heading */}
      <h2>Email Verification</h2>

      {/* Subtext */}
      <p style={{ textAlign: "center", marginBottom: "25px", color: "#555" }}>
        We have sent an OTP to your email {email}
      </p>
      <p style={{ textAlign: "center", marginBottom: "25px", color: "#555" }}>
        Want to change email? Ask admin
      </p>

      {/* OTP Inputs */}
      <div className="otp-inputs">
        {inputotp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={inputotp[index]}
            onChange={(e) => handleChange(e.target, index)}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button className="verify-btn" onClick={()=>VerifyOTP()}>Verify Account</button>

      {/* Resend Link */}
      <p className="resend-otp">
        Didn’t receive code?{" "}
        <span onClick={() => ResendOTP()}
            style={{color:disable?"gray":"blue",
                cursor:disable?'not-allowed':'pointer',
                textDecoration:disable?'none':'underline'
            }}
            >{disable?`Resend OTP in ${timer}s`: 'Resend OTP'}</span>
      </p>
    </div>
  );
}

export default OTPinput;
