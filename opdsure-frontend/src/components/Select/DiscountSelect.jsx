import CONSTANTS from "../../constant/Constants";
import { capitalizeFirstLetter } from "../../utils";
import { Select } from 'antd';
const { Option } = Select;

const DiscountSelect = ({ status, onChange, value, ...props }) => {
  const options = Object.entries(CONSTANTS.COUPON_DISC_TYPE).map(([key, val]) => (
    <Option key={key} value={val}>
      {capitalizeFirstLetter(key)}
    </Option>
  ));

  return (
    <Select
      value={value}
      onChange={onChange}
      {...props}
    >
      {options}
    </Select>
  );
};

export default DiscountSelect;
