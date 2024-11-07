import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConfig'; // Firestore config
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore'; // Firestore methods
import styles from './BillingTable.module.css'; // BillingTable styles

const BillingTable = () => {
  // State to hold billing data
  const [billingData, setBillingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // States for filtering inputs
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchAlternatePhone, setSearchAlternatePhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchPincode, setSearchPincode] = useState('');
  const [searchFullAddress, setSearchFullAddress] = useState('');
  const [searchPaymentMethod, setSearchPaymentMethod] = useState('');
  const [searchPaymentStatus, setSearchPaymentStatus] = useState('');
  const [searchRepresentative, setSearchRepresentative] = useState('');
  const [searchCreationDate, setSearchCreationDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Additional states for updating selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false); 
  const [updatePaymentStatus, setUpdatePaymentStatus] = useState('');
  const [updateRepresentative, setUpdateRepresentative] = useState('');

  const stateCityDistrictMap = {
    "Andhra Pradesh": {
      cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
      districts: ["Visakhapatnam", "Krishna", "Guntur", "Chittoor", "Nellore"]
    },
  };

  // Fetch billing data from Firestore
  useEffect(() => {
    const billingQuery = query(collection(db, 'billing'));
    const billingUnsubscribe = onSnapshot(billingQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBillingData(data);
      setFilteredData(data); // Set filtered data to the complete list initially
    }, (error) => {
      console.error('Error fetching billing data:', error);
    });

    return () => {
      billingUnsubscribe(); // Cleanup subscription for billing data
    };
  }, []);

  // Filter function based on input fields
  useEffect(() => {
    const filterResults = billingData.filter(bill => {
      return (
        bill.firstName.toLowerCase().includes(searchFirstName.toLowerCase()) &&
        bill.lastName.toLowerCase().includes(searchLastName.toLowerCase()) &&
        bill.phone.includes(searchPhone) &&
        (bill.alternatePhone?.includes(searchAlternatePhone) || 'N/A'.includes(searchAlternatePhone)) &&
        bill.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        (bill.city && bill.city.toLowerCase().includes(searchCity.toLowerCase())) &&
        (bill.district && bill.district.toLowerCase().includes(searchDistrict.toLowerCase())) &&
        (bill.state && bill.state.toLowerCase().includes(searchState.toLowerCase())) &&
        bill.pincode.includes(searchPincode) &&
        bill.fullAddress.toLowerCase().includes(searchFullAddress.toLowerCase()) &&
        bill.paymentMethod.toLowerCase().includes(searchPaymentMethod.toLowerCase()) &&
        bill.payment.toLowerCase().includes(searchPaymentStatus.toLowerCase()) &&
        (bill.representative?.toLowerCase().includes(searchRepresentative.toLowerCase()) || 'N/A'.includes(searchRepresentative.toLowerCase())) &&
        new Date(bill.creationDate).toLocaleDateString().includes(searchCreationDate)
      );
    });
    setFilteredData(filterResults);
  }, [
    searchFirstName, searchLastName, searchPhone, searchAlternatePhone, searchEmail, searchCity, searchDistrict,
    searchState, searchPincode, searchFullAddress, searchPaymentMethod, searchPaymentStatus, searchRepresentative, 
    searchCreationDate, billingData
  ]);

  // Handle state, city, district changes
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity(''); // Reset city when state changes
    setSelectedDistrict(''); // Reset district when state changes
    setSearchState(newState);
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setSelectedDistrict(''); // Reset district when city changes
    setSearchCity(newCity);
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    setSearchDistrict(newDistrict);
  };

  // Handle row selection
  const handleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle "Select All" functionality
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allIds = filteredData.map(row => row.id);
      setSelectedRows(allIds); // Select all row ids
    } else {
      setSelectedRows([]); // Deselect all
    }
  };

  // Update selected rows
  const handleUpdate = async () => {
    try {
      // Check if both fields are filled
      if (!updatePaymentStatus || !updateRepresentative) {
        alert('Please select both Payment Status and Representative before updating.');
        return; // Stop execution if either field is not selected
      }
  
      // Proceed with updating selected rows if validation passes
      for (let rowId of selectedRows) {
        const docRef = doc(db, 'billing', rowId);
        await updateDoc(docRef, {
          payment: updatePaymentStatus,
          representative: updateRepresentative,
        });
      }
  
      alert('Rows updated successfully');
      setSelectedRows([]); // Clear selection after update
      setUpdatePaymentStatus(''); // Reset update fields
      setUpdateRepresentative('');
    } catch (error) {
      console.error('Error updating rows:', error);
      alert('Failed to update rows');
    }
  };
  

    // Clear input fields
    const handleClear = () => {
      setSearchFirstName('');
      setSearchLastName('');
      setSearchPhone('');
      setSearchAlternatePhone('');
      setSearchEmail('');
      setSearchCity('');
      setSearchDistrict('');
      setSearchState('');
      setSearchPincode('');
      setSearchFullAddress('');
      setSearchPaymentMethod('');
      setSearchPaymentStatus('');
      setSearchRepresentative('');
      setSearchCreationDate('');
      setSelectedState('');
      setSelectedCity('');
      setSelectedDistrict('');
    };


// Refresh billing data
const handleRefresh = () => {
  const billingQuery = query(collection(db, 'billing'));
  const billingUnsubscribe = onSnapshot(billingQuery, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBillingData(data);
    setFilteredData(data); // Reset filtered data to fresh data
  }, (error) => {
    console.error('Error fetching billing data:', error);
  });
  // Optionally, you can also add a cleanup function for the refresh listener here if needed
};

  return (
    <div className={styles.billingTableContainer}>
      <h2>Billing Information Table</h2>

      {/* Filtering Input Fields */}
      <div className={styles.filterContainer}>
        {/* Add filtering inputs here (same as before) */}
        <input
          type="text"
          className={styles.inputField}
          placeholder="First Name"
          value={searchFirstName}
          onChange={(e) => setSearchFirstName(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Last Name"
          value={searchLastName}
          onChange={(e) => setSearchLastName(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Alternate Phone"
          value={searchAlternatePhone}
          onChange={(e) => setSearchAlternatePhone(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <select value={selectedState} onChange={handleStateChange} className={styles.inputField}>
          <option value="">Select State</option>
          {Object.keys(stateCityDistrictMap).map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <input
          type="text"
          className={styles.inputField}
          placeholder="City"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="District"
          value={searchDistrict}
          onChange={(e) => setSearchDistrict(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Pincode"
          value={searchPincode}
          onChange={(e) => setSearchPincode(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Full Address"
          value={searchFullAddress}
          onChange={(e) => setSearchFullAddress(e.target.value)}
        />
        <select
          value={searchPaymentMethod}
          onChange={(e) => setSearchPaymentMethod(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Payment Method</option>
          <option value="Online">online</option>
          <option value="Cash">cash</option>
        </select>
        <select
          value={searchPaymentStatus}
          onChange={(e) => setSearchPaymentStatus(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Payment Status</option>
          <option value="Pending">pending</option>
          <option value="Successful">successful</option>
        </select>

        <select
          value={searchRepresentative}
          onChange={(e) => setSearchRepresentative(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Search Representative</option>
          <option value="Yasir">Yasir</option>
          <option value="Maryum">Maryum</option>
          <option value="Affan">Affan</option>
        </select>

        {/* State, City, District Selectors 
        
        <select value={selectedCity} onChange={handleCityChange} className={styles.inputField}>
          <option value="">Select City</option>
          {selectedState && stateCityDistrictMap[selectedState].cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select value={selectedDistrict} onChange={handleDistrictChange} className={styles.inputField}>
          <option value="">Select District</option>
          {selectedState && stateCityDistrictMap[selectedState].districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
*/}
        {/* Add Payment Status and Representative Select */}
        <hr />
       <select
  value={updatePaymentStatus} // bind the value to the state
  onChange={(e) => setUpdatePaymentStatus(e.target.value)} // update the state on change
  className={styles.inputField}
>
  <option value="">Payment Status</option>
  <option value="Pending">Pending</option>
  <option value="Successful">Successful</option>
</select>

        <select
          value={updateRepresentative}
          onChange={(e) => setUpdateRepresentative(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Select Representative</option>
          <option value="Yasir">Yasir</option>
          <option value="Maryum">Maryum</option>
          <option value="Affan">Affan</option>
        </select>

        <button onClick={handleUpdate} className={styles.updateBillingButton}>
          Update Selected
        </button>

        <button onClick={handleClear} className={styles.updateBillingButton}>
          Clear Fields
        </button>

        <button onClick={handleRefresh} className={styles.updateBillingButton}>
          Refresh
        </button>


      </div>



      {/* Billing Data Table */}

      <table className={styles.billingTable}>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              /> 
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Alternate Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>District</th>
            <th>State</th>
            <th>Pincode</th>
            <th>Full Address</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Representative</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(bill => (
            <tr key={bill.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(bill.id)}
                  onChange={() => handleRowSelection(bill.id)}
                />
              </td>
              <td>{bill.firstName}</td>
              <td>{bill.lastName}</td>
              <td>{bill.phone}</td>
              <td>{bill.alternatePhone || 'N/A'}</td>
              <td>{bill.email}</td>
              <td>{bill.city}</td>
              <td>{bill.district}</td>
              <td>{bill.state}</td>
              <td>{bill.pincode}</td>
              <td>{bill.fullAddress}</td>
              <td>{bill.paymentMethod}</td>
              <td>{bill.payment}</td>
              <td>{bill.representative || 'N/A'}</td>
              <td>{new Date(bill.creationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
