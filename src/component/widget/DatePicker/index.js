import SinglePicker from './SinglePicker';
import DoublePicker from './DoublePicker';
import MyMonthPicker from './MyMonthPicker';
const DatePicker = SinglePicker;
DatePicker.RangePicker = DoublePicker;
DatePicker.MonthPicker = MyMonthPicker;
export default DatePicker;