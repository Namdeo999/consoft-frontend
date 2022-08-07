import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {COLORS, SIZES, FONTS} from '../../../constants';
import CheckBox from '@react-native-community/checkbox';
import CalendarPicker from 'react-native-calendar-picker';
import {
  getUserLeaves,
  postUserLeaves,
} from '../../../controller/LeavesController';
import {CustomToast} from '../../../Components';

const Profile = () => {
  const [selectedStartDate, setSelectedStartDate] = React.useState(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState(null);
  const [leaves, setLeaves] = React.useState([]);
  const [checked, setChecked] = React.useState({});
  const [data, setData] = React.useState('');
  const arr = {leavedates: data};
  // CUSTOM TOAST OF CRUD OPERATIONS
  const [submitToast, setSubmitToast] = React.useState(false);

  const checkBoxHandler = leave_date_id => {
    let d = [...data, leave_date_id];
    setData(d);
  };

  const onDateChange = (date, type) => {
    //function to handle the date change
    // if (type === 'END_DATE') {
    //   setSelectedEndDate(date);
    // } else {
    //   setSelectedEndDate(null);
    setSelectedStartDate(date);
    // }
  };

  // ========================== Apis ==========================

  const userLeaves = async () => {
    let response = await getUserLeaves();
    if (response.status === 200) {
      setLeaves(response.data);
    }
  };

  const postLeaves = async id => {
    let response = await postUserLeaves(id, arr);
    if (response.status === 200) {
      setSubmitToast(true);
    }
    setTimeout(() => {
      setSubmitToast(false);
    }, 1500);
  };

  React.useEffect(() => {
    userLeaves();
  }, []);

  function renderUserLeavesList() {
    const renderItem = ({item}) => (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
          }}>
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.lightblue_700,
              textTransform: 'capitalize',
            }}>
            {item.user_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                right: 12,
                backgroundColor: COLORS.green,
                paddingHorizontal: 3,
                paddingVertical: 0.5,
                borderRadius: 1,
              }}
              onPress={() => postLeaves(item._id)}>
              <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>
                Approve
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.rose_600,
                paddingHorizontal: 3,
                paddingVertical: 0.5,
                borderRadius: 1,
              }}
              onPress={() => alert('Approved')}>
              <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {item.leavedates.map((el, index) => {
          return (
            <View key={index} style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text style={{...FONTS.h5, color: COLORS.darkGray}}>
                    {index + 1}.{' '}
                  </Text>
                  <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                    Leave date -{' '}
                  </Text>
                  <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                    {el.leave_date}
                  </Text>
                </View>
                <CheckBox
                  disabled={false}
                  value={checked[el._id]}
                  onValueChange={newValue => {
                    setChecked({...checked, [el._id]: newValue});
                  }}
                  onChange={() => checkBoxHandler({leave_date_id: el._id})}
                  style={{height: 20}}
                />
              </View>
            </View>
          );
        })}
      </View>
    );

    return (
      <View
        style={{
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.radius,
          backgroundColor: COLORS.white,
          borderRadius: 3,
          ...styles.shadow,
        }}>
        <Text style={{...FONTS.h2, color: COLORS.darkGray}}>Leaves List</Text>

        <View style={{marginTop: SIZES.base}}>
          <FlatList
            data={leaves}
            keyExtractor={item => `${item._id}`}
            renderItem={renderItem}
            maxHeight={310}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: COLORS.lightGray1,
                    marginVertical: 10,
                  }}></View>
              );
            }}
          />
        </View>
      </View>
    );
  }

  function renderCalender() {
    return (
      <View
        style={{
          marginBottom: 60,
          marginTop: 30,
          marginHorizontal: SIZES.radius,
          padding: 10,
          borderRadius: 5,
          backgroundColor: COLORS.white,
          ...styles.shadow,
        }}>
        <CalendarPicker
          width={350}
          height={350}
          showDayStragglers={true}
          startFromMonday={true}
          minDate={new Date(2000, 1, 1)}
          maxDate={new Date(2050, 6, 3)}
          weekdays={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          months={[
            'January',
            'Febraury',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ]}
          onDateChange={onDateChange}
          monthTitleStyle={{
            backgroundColor: COLORS.rose_600,
            paddingHorizontal: 5,
            paddingVertical: 2,
            color: 'white',
            fontSize: 18,
          }}
          yearTitleStyle={{
            backgroundColor: COLORS.yellow_400,
            paddingHorizontal: 5,
            paddingVertical: 2,
            color: 'black',
            fontSize: 18,
          }}
          todayBackgroundColor={COLORS.rose_600}
          todayTextStyle={{color: 'white'}}
          previousTitle={'<'}
          nextTitle={'>'}
          previousTitleStyle={{fontSize: 25}}
          nextTitleStyle={{fontSize: 25}}
          selectedDayColor={'#16a34a'}
          selectedDayTextColor={'white'}
          selectedDayTextStyle={{fontSize: 18}}
          textStyle={{fontSize: 15}}
          selectMonthTitle={'Select Month '}
          selectYearTitle={'Select Year'}
        />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {renderUserLeavesList()}
      {renderCalender()}
      <CustomToast
        isVisible={submitToast}
        onClose={() => setSubmitToast(false)}
        color={COLORS.green}
        title="Approved"
        message="Approved Successfully..."
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#0000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default Profile;
