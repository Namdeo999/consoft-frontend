import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {getProjects} from '../../../controller/ProjectController';
import {SIZES, FONTS, COLORS, icons, reportdata} from '../../../constants';
import {
  getManpower,
  getReport,
  getQuantity,
  verifyReport,
  revertReport,
  finalVerifyReport,
  finalRevertReport,
} from '../../../controller/ReportController';
import {getProjectReportPath} from '../../../controller/ReportController';
import {getUserId} from '../../../services/asyncStorageService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ReportPdf from './ReportPdf';

const ReportDisplay = () => {
  const companyDetail = useSelector(state => state.company);
  const userData = useSelector(state => state.user);

  var companyData;
  if (companyDetail._id) {
    companyData = companyDetail;
  } else {
    companyData = userData;
  }

  const company_id = companyData._id;
  const [userId, setUserId] = React.useState('');
  // console.log(userId)
  const getUser_Id = async () => {
    const id = await getUserId();
    setUserId(id);
  };

  // projects
  const [onSelect, setOnSelect] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [projectValue, setProjectValue] = React.useState([]);
  const [project, setProject] = React.useState([]);

  const [report, setReport] = React.useState([]);
  const [reportModal, setReportModal] = React.useState(false);
  const [reportData, setReportData] = React.useState('');

  //report
  const [manpower, setManpower] = React.useState([]);
  const [quantity, setQuantity] = React.useState([]);

  //report path
  const [reportPath, setReportPath] = React.useState([]);

  // for report verify
  const [projectId, setProjectId] = React.useState('');
  const [reportId, setReportId] = React.useState('');

  //modal
  const [revertModal, setRevertModal] = React.useState(false);
  const [finalRevertModal, setFinalRevertModal] = React.useState(false);
  const [revertMsg, setRevertMsg] = React.useState('');
  const [finalRevertMsg, setFinalRevertMsg] = React.useState('');

  // get projects
  const fetchProject = async () => {
    let response = await getProjects(company_id);
    if (response.status === 200) {
      let projectFromApi = response.data.map(ele => {
        return {label: ele.project_name, value: ele._id};
      });
      setProject(projectFromApi);
    }
  };

  // get report
  const user_id = '';
  const fetchReport = async project_id => {
    setProjectId(project_id);
    let response = await getReport(project_id, user_id);
    // console.log(response);
    setReport(response.data);
  };

  // fetch manpower report on click
  const fetchManpower = async report_id => {
    setReportId(report_id);
    let response = await getManpower(report_id);
    if (response.status === 200) {
      setManpower(response.data);
    }
  };

  // fetch quantity report on click
  const fetchQuantity = async report_id => {
    // console.log(report_id);
    let response = await getQuantity(report_id);
    // console.log(response);
    if (response.status === 200) {
      setQuantity(response.data);
    }
  };

  // fetch report path
  const fetchReportPath = async project_id => {
    const response = await getProjectReportPath(company_id, project_id);
    // console.log(response);
    setReportPath(response.data);
  };

  // fetch verify report
  const fetchVerifyReport = async () => {
    let response = await verifyReport(projectId, reportId, userId);
    if (response.status === 200) {
      alert('Verified Successfully');
      fetchReport();
    }
  };

  const fetchFinalVerifyReport = async () => {
    let response = await finalVerifyReport(company_id, projectId, reportId);
    // console.log(response)
    if (response.status === 200) {
      alert('Final Verified Successfully');
      fetchReport();
    }
  };

  // fetch revert report
  const submitRevertReport = async () => {
    const formData = {
      revert_msg: revertMsg,
    };
    let response = await revertReport(projectId, reportId, userId, formData);
    if (response.status === 200) {
      alert('Reverted Successfully');
      setRevertMsg('');
      setRevertModal(false);
      fetchReport();
    } else {
      alert(response.message);
    }
  };

  const onFinalRevertReport = async () => {
    const formData = {
      revert_msg: finalRevertMsg,
    };
    let response = await finalRevertReport(
      company_id,
      projectId,
      reportId,
      formData,
    );
    if (response.status === 200) {
      alert('Reverted Successfully');
      setFinalRevertMsg('');
      setFinalRevertModal(false);
      fetchReport();
    } else {
      alert(response.message);
    }
  };

  // open project dropdown
  const onProjectOpen = React.useCallback(() => {
    setOnSelect(false);
    fetchProject();
    getUser_Id();
  }, []);

  React.useEffect(() => {
    fetchReport();
  }, []);

  //pdf
  // const createPDF = async () => {
  //   let options = {
  //     html: ReportPdf(reportData, manpower, quantity),
  //     fileName: 'report',
  //     directory: 'Documents',
  //   };

  //   let file = await RNHTMLtoPDF.convert(options);
  //   alert('Pdf Created Successfully');
  // };

  // date section
  const [date, setDate] = React.useState(new Date());
  const MyDateString =
    date.getFullYear() +
    '/' +
    ('0' + date.getDate()).slice(-2) +
    '/' +
    ('0' + (date.getMonth() + 1)).slice(-2);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };
  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
      display: 'spinner',
    });
  };
  const showDatepicker = () => {
    showMode('date');
  };

  function renderProjectFilter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '85%',
            ...styles.shadow,
          }}>
          <DropDownPicker
            style={{
              borderWidth: null,
              backgroundColor: COLORS.white,
              minHeight: 40,
              borderRadius: 5,
            }}
            dropDownContainerStyle={{
              backgroundColor: COLORS.darkGray,
              borderWidth: null,
              borderRadius: 5,
            }}
            textStyle={{
              fontSize: 16,
              color: COLORS.black,
              textTransform: 'capitalize',
            }}
            listParentLabelStyle={{color: COLORS.white, fontSize: 15}}
            placeholder="Select project"
            open={openProject}
            value={projectValue}
            items={project}
            setOpen={setOpenProject}
            setValue={setProjectValue}
            setItems={setProject}
            tickIconStyle={{
              width: 18,
              height: 18,
              backgroundColor: COLORS.white,
              tintColor: 'black',
            }}
            onSelectItem={value => {
              fetchReport(value.value);
              setOnSelect(true);
              fetchReportPath(value.value);
            }}
            onOpen={onProjectOpen}
            autoScroll={false}
            arrowIconStyle={{
              width: 25,
              height: 25,
              tintColor: 'black',
            }}
            zIndexInverse={1000}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.darkGray,
            padding: 10,
            borderRadius: 5,
          }}
          onPress={showDatepicker}>
          <Image
            source={icons.filter}
            style={{height: 18, width: 18, tintColor: '#ffffff'}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // report user list
  function renderReport() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 10,
          elevation: 1,
        }}
        onPress={() => {
          setReportModal(true);
          setReportData({
            project_name: item.project_name,
            user_name: item.user_name,
            user_id: item.user_id,
            date: item.report_date,
            time: item.report_time,
            admin_1_status: item.admin_1_status,
            admin_2_status: item.admin_2_status,
            admin_1_revert_msg: item.admin_1_revert_msg,
            admin_2_revert_msg: item.admin_2_revert_msg,
            verify_1_status: item.verify_1_status,
            verify_1_revert_msg: item.verify_1_revert_msg,
            verify_1_revert: item.verify_1_revert,
            verify_2_status: item.verify_2_status,
            verify_2_revert_msg: item.verify_2_revert_msg,
            verify_2_revert: item.verify_2_revert,
            admin_1_revert: item.admin_1_revert,
            admin_2_revert: item.admin_2_revert,
            final_verify_status: item.final_verify_status,
            final_verify_revert_msg: item.final_verify_revert_msg,
            final_verify_revert: item.final_verify_revert,
          });
          fetchManpower(item._id);
          fetchQuantity(item._id);
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.darkGray,
            textTransform: 'capitalize',
          }}>
          {item.user_name}
        </Text>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Image
              source={icons.date}
              style={{height: 12, width: 12, right: 5}}
            /> */}
            <Text style={{fontSize: 12, color: COLORS.darkGray}}>
              {item.report_date}
            </Text>
            <Text style={{fontSize: 12, color: COLORS.darkGray, left: 5}}>
              {item.report_time}
            </Text>
          </View>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.time}
              style={{height: 12, width: 12, right: 10}}
            />
            <Text style={{fontSize: 12, color: COLORS.darkGray}}>
              {item.report_time}
            </Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        contentContainerStyle={{marginTop: 20}}
        data={report}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                marginVertical: SIZES.base - 2,
              }}></View>
          );
        }}
      />
    );
  }

  // report showing modal
  function renderReportModal() {
    const renderItem = ({item, index}) => (
      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.gray2,
          padding: 10,
          width: SIZES.width / 2.3,
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: 'black',
            textDecorationLine: 'underline',
            textTransform: 'capitalize',
            marginBottom: 3,
          }}>
          {item.contractor_name}
        </Text>
        <View style={{}}>
          {item.manpowerCategories.map((ele, i) => {
            return (
              <View
                key={i}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{...FONTS.h4, color: COLORS.black}}>{i + 1}.</Text>
                <View
                  style={{
                    left: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: COLORS.black,
                    }}>
                    {ele.manpower_category_name} {' - '}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: COLORS.black,
                    }}>
                    {ele.manpower_member}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );

    const headerComponent = () => (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              flex: 1,
              fontSize: 25,
              color: COLORS.lightblue_800,
              textTransform: 'capitalize',
            }}>
            {reportData.project_name}
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 14, color: COLORS.black}}>
                Date{' - '}
              </Text>
              <Text style={{fontSize: 13, color: COLORS.black}}>
                {reportData.date}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 14, color: COLORS.black}}>
                Time{' - '}
              </Text>
              <Text style={{fontSize: 13, color: COLORS.black}}>
                {reportData.time}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            marginTop: 15,
            marginBottom: 5,
            borderColor: COLORS.gray2,
          }}></View>
        <View>
          <Text
            style={{
              fontSize: 18,
              color: COLORS.lightblue_700,
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginBottom: 5,
            }}>
            Manpower
          </Text>
          <Text style={{...FONTS.h3, color: COLORS.black}}>Contractors</Text>
        </View>
      </View>
    );

    const footerComponent = () => (
      <View>
        {renderQuantity()}
        {renderFooter()}
      </View>
    );

    return (
      <Modal animationType="slide" transparent={true} visible={reportModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.transparentBlack7,
          }}>
          <View
            style={{
              top: 20,
              backgroundColor: COLORS.white,
              paddingHorizontal: SIZES.base,
              // paddingBottom: SIZES.radius,
              height: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setReportModal(false);
                }}
                style={{top: -5}}>
                <Image
                  source={icons.minus}
                  style={{height: 30, width: 35, tintColor: COLORS.darkGray}}
                />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              onPress={createPDF}
              style={{alignItems: 'flex-end'}}>
              <Text style={{color: COLORS.black, ...FONTS.h4}}>Print</Text>
            </TouchableOpacity> */}
            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.darkGray2,
                padding: 12,
              }}>
              <FlatList
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                data={manpower}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                scrollEnabled={true}
                maxHeight={600}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return <View style={{margin: 5}}></View>;
                }}
                ListHeaderComponent={headerComponent}
                ListFooterComponent={footerComponent}
              />
            </View>
          </View>
        </View>
        {/* </View> */}
      </Modal>
    );
  }

  // quantity report
  function renderQuantity() {
    const renderItem = ({item, index}) =>
      item.quantityWorkItems.map((ele, i) => {
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  flex: 1,
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                {ele.item_name}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.5,
                  color: COLORS.black,
                  textAlign: 'right',
                }}>
                {ele.num_length}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.5,
                  color: COLORS.black,
                  textAlign: 'right',
                }}>
                {ele.num_width}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.5,
                  color: COLORS.black,
                  textAlign: 'right',
                }}>
                {ele.num_height}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1,
                  color: COLORS.black,
                  textAlign: 'right',
                }}>
                {ele.num_total}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  flex: 1,
                  color: COLORS.black,
                  textAlign: 'right',
                }}>
                {ele.remark}
              </Text>
            </View>
            {/* {i == 0 ? (
              <View
                style={{
                  borderBottomWidth: 1,
                  marginVertical: index == 0 ? 10 : null,
                  borderColor: COLORS.darkGray2,
                }}></View>
            ) : null} */}
            <View style={{marginTop:8}}>
              {ele.subquantityitems.map((ele, i) => {
                return (
                  <View key={i}>
                    {i == 0 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            flex: 1,
                            ...FONTS.h4,
                            color: COLORS.black,
                          }}></Text>
                        <Text
                          style={{
                            ...FONTS.h4,
                            flex: 0.5,
                            color: COLORS.black,
                            textAlign: 'right',
                          }}>
                          L
                        </Text>
                        <Text
                          style={{
                            ...FONTS.h4,
                            flex: 0.5,
                            color: COLORS.black,
                            textAlign: 'right',
                          }}>
                          W
                        </Text>
                        <Text
                          style={{
                            ...FONTS.h4,
                            flex: 0.5,
                            color: COLORS.black,
                            textAlign: 'right',
                          }}>
                          H
                        </Text>
                        <Text
                          style={{
                            ...FONTS.h4,
                            flex: 1,
                            color: COLORS.black,
                            textAlign: 'right',
                          }}>
                          Total
                        </Text>
                        <Text
                          style={{
                            ...FONTS.h3,
                            flex: 1,
                            color: COLORS.black,
                            textAlign: 'right',
                          }}>
                          Quality
                        </Text>
                      </View>
                    ) : null}
                    <View
                      style={{
                        left: 100,
                        borderBottomWidth: 1,
                        borderColor: COLORS.darkGray2,
                        width: '75%',
                        marginVertical: 5,
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          ...FONTS.h4,
                          color: COLORS.black,
                        }}></Text>
                      <Text
                        style={{
                          ...FONTS.h4,
                          flex: 0.5,
                          color: COLORS.black,
                          textAlign: 'right',
                        }}>
                        {ele.sub_length}
                      </Text>
                      <Text
                        style={{
                          ...FONTS.h4,
                          flex: 0.5,
                          color: COLORS.black,
                          textAlign: 'right',
                        }}>
                        {ele.sub_width}
                      </Text>
                      <Text
                        style={{
                          ...FONTS.h4,
                          flex: 0.5,
                          color: COLORS.black,
                          textAlign: 'right',
                        }}>
                        {ele.sub_height}
                      </Text>
                      <Text
                        style={{
                          ...FONTS.h4,
                          flex: 1,
                          color: COLORS.black,
                          textAlign: 'right',
                        }}>
                        {ele.sub_total}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          flex: 1,
                          color: COLORS.black,
                          textAlign: 'right',
                        }}>
                        {ele.sub_quality_type}
                      </Text>
                    </View>
                  </View>
                );
              })}
              {i == 0 ? (
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginVertical: index == 0 ? 10 : null,
                    borderColor: COLORS.darkGray,
                  }}></View>
              ) : null}
            </View>
          </View>
        );
      });

    return (
      <View>
        <View
          style={{
            borderBottomWidth: 1,
            marginTop: 15,
            marginBottom: 5,
            borderColor: COLORS.gray2,
          }}></View>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.lightblue_700,
            textAlign: 'center',
            textDecorationLine: 'underline',
            marginBottom: 5,
          }}>
          Excluded Quantity
        </Text>
        <FlatList
          data={quantity}
          keyExtractor={item => `${item._id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.darkGray,
                  marginVertical: 10,
                }}></View>
            );
          }}
          ListHeaderComponent={
            <View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  Items
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    flex: 0.5,
                    color: COLORS.black,
                    textAlign: 'right',
                  }}>
                  L
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    flex: 0.5,
                    color: COLORS.black,
                    textAlign: 'right',
                  }}>
                  W
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    flex: 0.5,
                    color: COLORS.black,
                    textAlign: 'right',
                  }}>
                  H
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    flex: 1,
                    color: COLORS.black,
                    textAlign: 'right',
                  }}>
                  Total
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                    flex: 1,
                    color: COLORS.black,
                    textAlign: 'right',
                  }}>
                  Remark
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: COLORS.darkGray,
                  marginBottom: 10,
                }}></View>
            </View>
          }
        />
      </View>
    );
  }

  function renderFooter() {
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 1,
            marginTop: 15,
            marginBottom: 10,
            borderColor: COLORS.gray2,
          }}></View>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.lightblue_700,
            textAlign: 'center',
            textDecorationLine: 'underline',
            marginBottom: 15,
          }}>
          Report Progress Status -
        </Text>
        {/* <Text
          style={{
            fontSize: 18,
            color: COLORS.black,
            marginBottom: 8,
          }}>
          Report Progress Status:
        </Text> */}
        {reportPath.map((ele, i) => {
          return (
            <View key={i}>
              {ele.admin_1 === userId ? (
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        ...FONTS.h4,
                        textTransform: 'capitalize',
                        color: COLORS.black,
                      }}>
                      {ele.admin_1_name}(A1) -
                    </Text>
                    {reportData.admin_1_status === false ? (
                      <View
                        style={{
                          left: 10,
                          // flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Button
                            title="Verify"
                            color={COLORS.success_600}
                            disabled={
                              reportData.verify_1_status === false
                                ? true
                                : false
                            }
                            onPress={() => fetchVerifyReport()}
                          />

                          <View style={{left: 10}}>
                            <Button
                              title="Revert"
                              color={COLORS.rose_600}
                              disabled={
                                reportData.verify_1_status === false
                                  ? true
                                  : false
                              }
                              onPress={() => setRevertModal(true)}
                            />
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.admin_1_revert == true
                            ? 'Reverted'
                            : 'Verified'}
                        </Text>
                        <Image
                          source={
                            reportData.admin_1_revert == true
                              ? icons.revert
                              : icons.verify
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.admin_1_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    )}
                  </View>
                  {reportData.verify_1_status == true &&
                    reportData.admin_1_revert == true && (
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          marginBottom: 5,
                        }}>
                        Your Reverted msg{' - '}
                        {reportData.admin_1_revert_msg}
                      </Text>
                    )}
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.admin_2_name}(A2) {' - '}
                      </Text>
                      {/* {reportData.admin_2_status == true && ( */}
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.admin_2_revert == true
                            ? 'Reverted'
                            : reportData.admin_2_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.admin_2_revert == true
                              ? icons.revert
                              : reportData.admin_2_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.admin_2_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                      {/* )} */}
                    </View>
                    {reportData.admin_2_revert == true &&
                      reportData.verify_1_status == true && (
                        <Text
                          style={{
                            ...FONTS.h4,
                            color: COLORS.darkGray,
                            marginBottom: 5,
                          }}>
                          Msg - {reportData.admin_2_revert_msg}
                        </Text>
                      )}
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.verification_1_name}(V1) {' - '}
                      </Text>
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.verify_1_revert == true
                            ? 'Reverted'
                            : reportData.verify_1_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.verify_1_revert == true
                              ? icons.revert
                              : reportData.verify_1_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.verify_1_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    </View>
                    {reportData.verify_1_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Revert Msg - {reportData.verify_1_revert_msg}
                      </Text>
                    )}
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.verification_2_name}(V2) {' - '}
                      </Text>
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.verify_2_revert == true
                            ? 'Reverted'
                            : reportData.verify_2_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.verify_2_revert == true
                              ? icons.revert
                              : reportData.verify_2_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.verify_2_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    </View>
                    {reportData.verify_2_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Revert Msg - {reportData.verify_2_revert_msg}
                      </Text>
                    )}
                  </View>
                </View>
              ) : ele.admin_2 === userId ? (
                <View style={{}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        ...FONTS.h4,
                        textTransform: 'capitalize',
                        color: COLORS.black,
                      }}>
                      {ele.admin_2_name}(A2) -
                    </Text>
                    {reportData.admin_2_status === false ? (
                      <View
                        style={{
                          left: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Button
                            title="Verify"
                            color={COLORS.success_600}
                            disabled={
                              reportData.verify_1_status === false
                                ? true
                                : false
                            }
                            onPress={() => fetchVerifyReport()}
                          />

                          <View style={{left: 10}}>
                            <Button
                              title="Revert"
                              color={COLORS.rose_600}
                              disabled={
                                reportData.verify_1_status === false
                                  ? true
                                  : false
                              }
                              onPress={() => setRevertModal(true)}
                            />
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.admin_2_revert == true
                            ? 'Reverted'
                            : 'Verified'}
                        </Text>
                        <Image
                          source={
                            reportData.admin_2_revert == true
                              ? icons.revert
                              : icons.verify
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.admin_2_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    )}
                  </View>
                  {reportData.verify_1_status == true &&
                    reportData.admin_2_revert == true && (
                      <View>
                        {/* <Text
                        style={{
                          ...FONTS.h3,
                          color: COLORS.black,
                          marginTop: 5,
                        }}>
                        {ele.admin_1_name} reverted msg{' : '}
                        {reportData.admin_1_revert_msg}
                      </Text> */}
                        <Text
                          style={{
                            ...FONTS.h4,
                            color: COLORS.darkGray,
                            marginBottom: 5,
                          }}>
                          Your Reverted msg{' - '}
                          {reportData.admin_2_revert_msg}
                        </Text>
                      </View>
                    )}
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.admin_1_name}(A1) {' - '}
                      </Text>
                      {/* {reportData.admin_1_status == true && ( */}
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.admin_1_revert == true
                            ? 'Reverted'
                            : reportData.admin_1_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.admin_1_revert == true
                              ? icons.revert
                              : reportData.admin_1_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.admin_1_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                      {/* )} */}
                    </View>

                    {reportData.admin_1_revert == true &&
                      reportData.verify_1_status == true && (
                        <Text
                          style={{
                            ...FONTS.h4,
                            color: COLORS.darkGray,
                            marginBottom: 5,
                          }}>
                          Revert Msg - {reportData.admin_1_revert_msg}
                        </Text>
                      )}
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.verification_1_name}(V1) {' - '}
                      </Text>
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.verify_1_revert == true
                            ? 'Reverted'
                            : reportData.verify_1_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.verify_1_revert == true
                              ? icons.revert
                              : reportData.verify_1_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.verify_1_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    </View>
                    {reportData.verify_1_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Revert Msg - {reportData.verify_1_revert_msg}
                      </Text>
                    )}
                  </View>

                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.verification_2_name}(V2) {' - '}
                      </Text>
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.verify_2_revert == true
                            ? 'Reverted'
                            : reportData.verify_2_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.verify_2_revert == true
                              ? icons.revert
                              : reportData.verify_2_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.verify_2_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    </View>
                    {reportData.verify_2_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Revert Msg - {reportData.verify_2_revert_msg}
                      </Text>
                    )}
                  </View>
                </View>
              ) : null}

              {!userId ? (
                <View style={{}}>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.admin_1_name}(A1) {' - '}
                      </Text>
                      {/* {reportData.admin_1_status == true && ( */}
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.admin_1_revert == true
                            ? 'Reverted'
                            : reportData.admin_1_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.admin_1_revert == true
                              ? icons.revert
                              : reportData.admin_1_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.admin_1_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                      {/* )} */}
                    </View>
                    {reportData.admin_1_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Msg - {reportData.admin_1_revert_msg}
                      </Text>
                    )}
                  </View>
                  {/* <View
                    style={{
                      marginVertical: 8,
                      borderBottomWidth: 1,
                      borderColor: COLORS.darkGray2,
                    }}></View> */}
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.admin_2_name}(A2) {' - '}
                      </Text>
                      {/* {reportData.admin_2_status == true && ( */}
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.admin_2_revert == true
                            ? 'Reverted'
                            : reportData.admin_2_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.admin_2_revert == true
                              ? icons.revert
                              : reportData.admin_2_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.admin_2_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                      {/* )} */}
                    </View>
                    {reportData.admin_2_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Msg - {reportData.admin_2_revert_msg}
                      </Text>
                    )}
                  </View>
                  {/* <View
                    style={{
                      marginVertical: 8,
                      borderBottomWidth: 1,
                      borderColor: COLORS.darkGray2,
                    }}></View> */}
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.verification_1_name}(V1) {' - '}
                      </Text>
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.verify_1_revert == true
                            ? 'Reverted'
                            : reportData.verify_1_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.verify_1_revert == true
                              ? icons.revert
                              : reportData.verify_1_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.verify_1_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    </View>
                    {reportData.verify_1_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Msg - {reportData.verify_1_revert_msg}
                      </Text>
                    )}
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          textTransform: 'capitalize',
                        }}>
                        {ele.verification_2_name}(V2) {' - '}
                      </Text>
                      <View
                        style={{
                          left: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{...FONTS.h4, color: COLORS.black}}>
                          {reportData.verify_2_revert == true
                            ? 'Reverted'
                            : reportData.verify_2_status === true
                            ? 'Verified'
                            : null}
                        </Text>
                        <Image
                          source={
                            reportData.verify_2_revert == true
                              ? icons.revert
                              : reportData.verify_2_status == true
                              ? icons.verify
                              : null
                          }
                          style={{
                            left: 8,
                            width: 16,
                            height: 16,
                            tintColor:
                              reportData.verify_2_revert == true
                                ? 'red'
                                : 'green',
                          }}
                        />
                      </View>
                    </View>
                    {reportData.verify_2_revert == true && (
                      <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                        Msg - {reportData.verify_2_revert_msg}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: COLORS.gray2,
                      marginVertical: 8,
                    }}></View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        ...FONTS.h3,
                        color: COLORS.black,
                        textTransform: 'capitalize',
                      }}>
                      Final Verification -
                    </Text>
                    <View style={{left: 10}}>
                      <Button
                        title={
                          reportData.final_verify_status == true
                            ? 'Verified'
                            : 'Verify'
                        }
                        color={COLORS.success_600}
                        disabled={
                          reportData.admin_2_status == false ||
                          reportData.final_verify_status == true
                            ? true
                            : false
                        }
                        onPress={() => fetchFinalVerifyReport()}
                      />
                    </View>
                    {reportData.final_verify_status == false && (
                      <View style={{left: 30}}>
                        <Button
                          title={
                            reportData.final_verify_revert == true
                              ? 'Reverted'
                              : 'Revert'
                          }
                          color={COLORS.rose_600}
                          disabled={
                            reportData.admin_2_status == false ||
                            reportData.final_verify_revert == true
                              ? true
                              : false
                          }
                          onPress={() => setFinalRevertModal(true)}
                        />
                      </View>
                    )}
                  </View>
                  {reportData.final_verify_revert == true && (
                    <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
                      Msg - {reportData.final_verify_revert_msg}
                    </Text>
                  )}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }

  function renderRevertModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={revertModal}>
        <TouchableWithoutFeedback onPress={() => setRevertModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack7,
            }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: COLORS.white,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                width: '90%',
                top: '30%',
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 20, color: COLORS.darkGray}}>
                  Revert message
                </Text>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setRevertModal(false)}>
                    <Image
                      source={icons.cross}
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: COLORS.rose_600,
                      }}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.darkGray,
                }}>
                <TextInput
                  style={{color: COLORS.black}}
                  placeholder="Write your message..."
                  multiline={true}
                  numberOfLines={1}
                  onChangeText={value => {
                    setRevertMsg(value);
                  }}
                />
              </View>

              <TouchableOpacity
                style={{
                  marginTop: SIZES.padding,
                  alignItems: 'center',
                }}
                onPress={() => submitRevertReport()}>
                <Text
                  style={{
                    ...FONTS.h3,
                    backgroundColor: COLORS.lightblue_800,
                    paddingHorizontal: SIZES.radius,
                    paddingVertical: 5,
                    borderRadius: 3,
                    color: COLORS.white,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderFinalRevertModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={finalRevertModal}>
        <TouchableWithoutFeedback onPress={() => setFinalRevertModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.transparentBlack7,
            }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: COLORS.white,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                width: '90%',
                top: '30%',
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 20, color: COLORS.darkGray}}>
                  Revert message
                </Text>
                <ImageBackground
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    elevation: 20,
                  }}>
                  <TouchableOpacity onPress={() => setFinalRevertModal(false)}>
                    <Image
                      source={icons.cross}
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: COLORS.rose_600,
                      }}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.darkGray,
                }}>
                <TextInput
                  style={{color: COLORS.black}}
                  placeholder="Write your message..."
                  multiline={true}
                  numberOfLines={1}
                  onChangeText={value => {
                    setFinalRevertMsg(value);
                  }}
                />
              </View>

              <TouchableOpacity
                style={{
                  marginTop: SIZES.padding,
                  alignItems: 'center',
                }}
                onPress={() => onFinalRevertReport()}>
                <Text
                  style={{
                    ...FONTS.h3,
                    backgroundColor: COLORS.lightblue_800,
                    paddingHorizontal: SIZES.radius,
                    paddingVertical: 5,
                    borderRadius: 3,
                    color: COLORS.white,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <View style={{margin: SIZES.radius}}>
      {renderProjectFilter()}
      {renderRevertModal()}
      {renderFinalRevertModal()}
      {renderReportModal()}

      {onSelect == true && renderReport()}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default ReportDisplay;
