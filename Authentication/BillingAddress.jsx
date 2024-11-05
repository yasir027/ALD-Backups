import React, { useState, useEffect } from 'react';
import styles from './Billing.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../services/AuthContext'; 
import LoginPageImage from '../../assets/LoginPage.png';

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
