import React, { useState, useEffect } from 'react';
import styles from './Billing.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Razorpay from 'razorpay'; // Import Razorpay SDK
import { db } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../services/AuthContext'; 
import LoginPageImage from '../../assets/LoginPage.png';
import { createOrder, initiatePayment } from '../../services/razorpay'; // Update path as needed
import { getFirestore, getDoc } from 'firebase/firestore'; // Import Firebase Firestore



const stateCityDistrictMap = {
  "Andhra Pradesh": {
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
    districts: ["Visakhapatnam", "Krishna", "Guntur", "Chittoor", "Nellore"]
  },
  "Arunachal Pradesh": {
    cities: ["Itanagar", "Naharlagun", "Pasighat", "Tezpur", "Ziro"],
    districts: ["Itanagar", "Pasighat", "Lower Subansiri", "West Kameng", "Papum Pare"]
  },
  "Assam": {
    cities: ["Guwahati", "Dibrugarh", "Silchar", "Nagaon", "Tezpur"],
    districts: ["Guwahati", "Dibrugarh", "Tinsukia", "Nagaon", "Karimganj"]
  },
  "Bihar": {
    cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"]
  },
  "Chhattisgarh": {
    cities: ["Raipur", "Bhilai", "Durg", "Bilaspur", "Korba"],
    districts: ["Raipur", "Durg", "Bilaspur", "Korba", "Rajnandgaon"]
  },
  "Goa": {
    cities: ["Panaji", "Margao", "Mapusa", "Ponda", "Verna"],
    districts: ["North Goa", "South Goa"]
  },
  "Gujarat": {
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"]
  },
  "Haryana": {
    cities: ["Gurugram", "Faridabad", "Hisar", "Rohtak", "Ambala"],
    districts: ["Gurugram", "Faridabad", "Hisar", "Rohtak", "Ambala"]
  },
  "Himachal Pradesh": {
    cities: ["Shimla", "Dharamshala", "Kullu", "Manali", "Solan"],
    districts: ["Shimla", "Kullu", "Mandi", "Solan", "Dharamshala"]
  },
  "Jharkhand": {
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
    districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"]
  },
  "Karnataka": {
    cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belgaum"],
    districts: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belgaum"]
  },
  "Kerala": {
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Malappuram"],
    districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Malappuram"]
  },
  "Madhya Pradesh": {
    cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"]
  },
  "Maharashtra": {
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"]
  },
  "Manipur": {
    cities: ["Imphal", "Thoubal", "Kakching", "Churachandpur", "Ukhrul"],
    districts: ["Imphal East", "Imphal West", "Thoubal", "Churachandpur", "Kakching"]
  },
  "Meghalaya": {
    cities: ["Shillong", "Tura", "Jowai", "Nongstoin", "Bhoi"],
    districts: ["East Khasi Hills", "West Khasi Hills", "Jaintia Hills", "Garo Hills"]
  },
  "Mizoram": {
    cities: ["Aizawl", "Lunglei", "Saiha", "Kolasib", "Champhai"],
    districts: ["Aizawl", "Lunglei", "Saiha", "Kolasib", "Champhai"]
  },
  "Nagaland": {
    cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    districts: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"]
  },
  "Odisha": {
    cities: ["Bhubaneswar", "Cuttack", "Sambalpur", "Rourkela", "Berhampur"],
    districts: ["Khordha", "Cuttack", "Sambalpur", "Ganjam", "Balasore"]
  },
  "Punjab": {
    cities: ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
    districts: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Mohali"]
  },
  "Rajasthan": {
    cities: ["Jaipur", "Udaipur", "Jodhpur", "Ajmer", "Bikaner"],
    districts: ["Jaipur", "Udaipur", "Jodhpur", "Ajmer", "Bikaner"]
  },
  "Sikkim": {
    cities: ["Gangtok", "Namchi", "Pakyong", "Gyalshing", "Mangan"],
    districts: ["East Sikkim", "West Sikkim", "South Sikkim", "North Sikkim"]
  },
  "Tamil Nadu": {
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
  },
  "Telangana": {
    cities: ["Hyderabad", "Warangal", "Khammam", "Nizamabad", "Rangareddy"],
    districts: ["Hyderabad", "Warangal", "Khammam", "Nizamabad", "Rangareddy"]
  },
  "Tripura": {
    cities: ["Agartala", "Belonia", "Dharmanagar", "Udaipur", "Kailashahar"],
    districts: ["West Tripura", "South Tripura", "Dhalai", "North Tripura"]
  },
  "Uttar Pradesh": {
    cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad"],
    districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad"]
  },
  "Uttarakhand": {
    cities: ["Dehradun", "Haridwar", "Nainital", "Rudrapur", "Haldwani"],
    districts: ["Dehradun", "Nainital", "Haridwar", "Udhamsingh Nagar"]
  },
  "West Bengal": {
    cities: ["Kolkata", "Siliguri", "Howrah", "Durgapur", "Asansol"],
    districts: ["Kolkata", "Howrah", "Birbhum", "Murshidabad", "North 24 Parganas"]
  },
};

const BillingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionId = location.state?.subscriptionId || '';
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);



  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    fullAddress: '',
    state: '', // New state
    city: '',  // New city
    district: '', // New district
    pincode: '',
    paymentMethod: 'online',
    representative: null,
    payment: 'pending',
    subscriptionId: subscriptionId || '',
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);



  useEffect(() => {
    setBillingData((prevData) => ({ ...prevData, subscriptionId }));
  }, [subscriptionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingData({ ...billingData, [name]: value });

    // If state is changed, reset city and district
    if (name === "state") {
      setCities(stateCityDistrictMap[value]?.cities || []);
      setDistricts(stateCityDistrictMap[value]?.districts || []);
      setBillingData({ ...billingData, city: '', district: '' }); // Reset city and district
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !billingData.subscriptionId) {
      alert('User must be logged in and subscription ID is required.');
      return;
    }

    const finalBillingData = {
      ...billingData,
      uid: user.uid,
      creationDate: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'billing', user.uid), finalBillingData);
      alert('Billing information saved successfully!');
    } catch (error) {
      console.error('Error saving billing info:', error);
      alert('Failed to save billing information. Please try again.');
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setBillingData((prev) => ({ ...prev, state: selectedState, city: '', district: '' }));
    setCities(stateCityDistrictMap[selectedState]?.cities || []);
    setDistricts(stateCityDistrictMap[selectedState]?.districts || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  //RazorPay

// Fetch subscription price from Firestore
useEffect(() => {
  const fetchPrice = async () => {
      if (!subscriptionId) {
          setLoading(false);
          return;
      }

      try {
          const db = getFirestore(); // Initialize Firestore
          const subscriptionRef = doc(db, 'subscriptions', subscriptionId); // Reference to subscription document
          const subscriptionSnap = await getDoc(subscriptionRef);

          if (subscriptionSnap.exists()) {
              const data = subscriptionSnap.data();
              setPrice(data.price); // Set the price from Firestore
          } else {
              console.error('No such subscription!');
              setPrice(0);
          }
      } catch (error) {
          console.error('Error fetching subscription price:', error);
          setPrice(0);
      } finally {
          setLoading(false);
      }
  };

  fetchPrice();
}, [subscriptionId]);




const handlePayment = async () => {
  if (price <= 0) {
      alert('Invalid subscription or price not available.');
      return;
  }

  try {
      // Step 1: Call backend to create an order
      const response = await fetch('http://localhost:3000/api/payment/create-order', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              amount: price * 100, // Convert to paisa
              currency: 'INR',
              receipt: `receipt_${subscriptionId}`,
          }),
      });

      if (!response.ok) {
          console.error('Failed to create order:', response.status, response.statusText);
          alert('Failed to create Razorpay order. Please try again.');
          return;
      }

      const data = await response.json();

      if (!data || !data.success || !data.orderId) {
          console.error('Invalid response from order creation:', data);
          alert('Failed to create Razorpay order. Please try again.');
          return;
      }

      // Step 2: Open Razorpay payment interface
      const options = {
          key: 'rzp_test_1wSYUGMK0YWQFf', // Replace with your Razorpay Key ID
          amount: price * 100, // Amount in paisa
          currency: 'INR',
          name: 'ALD Online',
          description: `Subscription: ${subscriptionId}`,
          order_id: data.orderId, // Order ID from backend
          handler: async (response) => {
              try {
                  // Step 3: Verify the payment
                  const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                      }),
                  });

                  if (!verifyResponse.ok) {
                      console.error('Payment verification failed:', verifyResponse.status, verifyResponse.statusText);
                      alert('Payment verification failed. Please contact support.');
                      return;
                  }

                  const verifyData = await verifyResponse.json();

                  if (verifyData.success) {
                      alert('Payment successful!');
                      // TODO: Handle successful payment (e.g., update subscription status)
                  } else {
                      console.error('Payment verification response:', verifyData);
                      alert('Payment verification failed.');
                  }
              } catch (verifyError) {
                  console.error('Error verifying payment:', verifyError);
                  alert('An error occurred during payment verification. Please try again.');
              }
          },
          prefill: {
              name: 'Your Name', // Replace with actual customer name
              email: 'your.email@example.com', // Replace with actual customer email
              contact: '9999999999', // Replace with actual customer contact number
          },
          theme: {
              color: '#3399cc', // Customize Razorpay UI color
          },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
  } catch (error) {
      console.error('Error during payment:', error);
      alert('An error occurred while processing the payment. Please try again.');
  }
};

if (loading) {
  return <div>Loading subscription details...</div>;
}



  return (
    <div 
      className={styles.billingContainer}
      style={{
        backgroundImage: `url(${LoginPageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 80%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className={styles.billingForm}>
        <h2 className={styles.title}>Billing Address</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="firstName"
              className={styles.inputField}
              placeholder="First Name"
              value={billingData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              className={styles.inputField}
              placeholder="Last Name"
              value={billingData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="phone"
              className={styles.inputField}
              placeholder="Phone"
              value={billingData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="alternatePhone"
              className={styles.inputField}
              placeholder="Alternate Phone"
              value={billingData.alternatePhone}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="email"
              name="email"
              className={styles.inputField}
              placeholder="Email"
              value={billingData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="fullAddress"
              className={styles.inputField}
              placeholder="Full Address"
              value={billingData.fullAddress}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
          <select name="state" value={billingData.state} onChange={handleStateChange} required className={styles.inputField}>
  <option value="">Select State</option>
  {Object.keys(stateCityDistrictMap).map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>

<select name="city" value={billingData.city} onChange={handleChange} required className={styles.inputField}>
  <option value="">Select City</option>
  {cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>

<select name="district" value={billingData.district} onChange={handleChange} required className={styles.inputField}>
  <option value="">Select District</option>
  {districts.map((district) => (
    <option key={district} value={district}>
      {district}
    </option>
  ))}
</select>

          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="pincode"
              className={styles.inputField}
              placeholder="Pincode"
              value={billingData.pincode}
              onChange={handleInputChange}
              required
            />
          </div>

          <h3>Select Payment Method</h3>
          <div className={styles.paymentOptions}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={billingData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={billingData.paymentMethod === 'online'}
                onChange={handleInputChange}
              />
              Online
            </label>
            <button
              onClick={handlePayment}
              style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#3399cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
              }}
            >
                        Pay ₹{price}
                    </button>
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Billing Info
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
