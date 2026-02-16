import CONSTANTS from "../../constant/Constants";
import { Select } from "antd";
import { capitalizeFirstLetter } from "../../utils";
const { Option } = Select;

const StatusSelect = ({ status, onChange, value, ...props }) => {
  const options = Object.entries(CONSTANTS.STATUS).map(([key, val]) => (
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

export default StatusSelect;
