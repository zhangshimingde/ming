const handleFullTime = (time) => {
    return (`0${time}`).slice(-2);
};

const getTime = () => {
    const date = new Date();
    return `${date.getFullYear()}-${handleFullTime(date.getMonth() + 1)}-${handleFullTime(date.getDate())} ${handleFullTime(date.getHours())}:${handleFullTime(date.getMinutes())}:${handleFullTime(date.getSeconds())}`;
};

export default getTime;
