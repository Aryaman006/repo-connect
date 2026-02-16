import CONSTANTS from "../../constant/Constants";
import { capitalizeFirstLetter } from "../../utils";
import { Select } from 'antd';
const { Option } = Select;

const PlanFreqSelect = ({ status, onChange, value, ...props }) => {
  const options = Object.entries(CONSTANTS.CORPORATE.PLAN_FREQ).map(([key, val]) => (
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

export default PlanFreqSelect;
