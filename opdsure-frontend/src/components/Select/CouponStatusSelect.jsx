import CONSTANTS from "../../constant/Constants";
import { Select } from "antd";
import { capitalizeFirstLetter } from "../../utils";
const { Option } = Select;

const CouponStatusSelect = ({ status, onChange, value, ...props }) => {
  const options = Object.entries(CONSTANTS.COUPON_STATUS).map(([key, val]) => (
    <Option key={key} value={val}>
      {capitalizeFirstLetter(key)}
    </Option>
  ));

  return (
    <Select value={value} onChange={onChange} {...props}>
      {options}
    </Select>
  );
};

export default CouponStatusSelect;
