import { useState } from 'react';
import { Space, Select, Input } from 'antd';
const { Option } = Select;
import countryCodes  from "country-codes-list";
const myCountryCodesObject = countryCodes.customList('countryCode', '[{countryCode}] {countryNameEn}: +{countryCallingCode}');
const options = [
    { label: '+1', value: '1' }, // USA
    { label: '+44', value: '44' }, // UK
    { label: '+91', value: '91' }, // India
    // Add more country codes as needed
  ];

const MobileNoInput = ({ onChange }) => {
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState('');

  console.log(myCountryCodesObject,"-----------------------")
  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
    onChange(value, mobileNumber);
  };

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
    onChange(countryCode, e.target.value);
  };

  return (
    <Space.Compact>
      {/* <Select
        value={countryCode}
        options={options}
        onChange={handleCountryCodeChange}
        style={{ width: '30%' }} // Adjust the width as needed
      ><Option>

      </Option>
      </Select> */}
       <Input
        value={countryCode}
        onChange={handleCountryCodeChange}
        placeholder="Code"
        style={{ width: '30%' }} // Adjust the width as needed
      />
      <Input
        value={mobileNumber}
        onChange={handleMobileNumberChange}
        placeholder="Enter mobile number"
        style={{ width: '70%' }} // Adjust the width as needed
      />
    </Space.Compact>
  );
};

export default MobileNoInput;
