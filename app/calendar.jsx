import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from 'react-native';

function Calendar(){
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState(new Date())

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();


    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getStartDay = (year, month) => new Date(year, month, 1).getDay(); // 0 = Sunday

    const changeMonth = (offset) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
    };

    

    const renderCalendar = () => {
        const cells = [];

        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getStartDay(year, month);


        for (let i = 0; i < startDay; i++) {
        cells.push(<div key={`empty-${i}`} className="empty-cell"></div>);

        for (let day = 1; day <= daysInMonth; day++) {
        cells.push(
        <div key={day} className="day-cell">
            {day}
        </div>
        );
        }

        return cells;
        }

    };

    return (
    <div>
      <h2>{currentDate.toLocaleString('default', { month: 'long' })} {year}</h2>
      <button onClick={() => changeMonth(-1)}>Prev</button>
      <button onClick={() => changeMonth(1)}>Next</button>
      <div className="calendar-grid">{renderCalendar()}</div>
    </div>


);

}

const styles = StyleSheet.create({
    


});




export default Calendar;