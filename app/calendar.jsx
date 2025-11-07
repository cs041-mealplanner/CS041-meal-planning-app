import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

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

    // Empty cells before the first day
    for (let i = 0; i < startDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.emptyCell} />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(
        <View key={day} style={styles.dayCell}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
      );
    }

    return cells;
  };

 return (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <Text style={styles.header}>
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </Text>

      <View style={styles.nav}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
          <Text style={styles.navText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
          <Text style={styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>{renderCalendar()}</View>
    </View>
  </ScrollView>
);

}

// STYLE SHEETS

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  navText: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
     aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',

  },
  emptyCell: {
    width: '14.28%',
    aspectRatio: 1,

  },
  dayText: {
    fontSize: 16,
  },
  weekdayRow: {
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',

},

weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 6,
},

weekdayText: {
  fontWeight: 'bold',
  fontSize: 14,
}
});

export default Calendar;