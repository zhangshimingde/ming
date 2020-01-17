import Select from './Select';
import { Select as AntdSelect } from 'antd';
const { Option, OptGroup } = AntdSelect;
Select.Option = Option;
Select.OptGroup = OptGroup;
export default Select;