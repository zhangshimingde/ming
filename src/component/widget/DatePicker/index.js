import SinglePicker from './SinglePicker';
import MyMonthPicker from './MyMonthPicker';
import FlRangePicker from './FlRangePicker';
// import { DatePicker as Dp } from 'antd';
const DatePicker = SinglePicker;
DatePicker.MonthPicker = MyMonthPicker;
DatePicker.RangePicker = FlRangePicker;
// DatePicker.RangePicker = Dp.RangePicker;
export default DatePicker;