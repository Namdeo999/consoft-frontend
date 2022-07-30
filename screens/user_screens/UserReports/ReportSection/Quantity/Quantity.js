import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Animated,
  Easing,
  Switch,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Pressable,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  LogBox,
  LayoutAnimation,
  ImageBackground,
} from 'react-native';
import { Card, Title, DataTable, Divider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../ReportStyle.js';
import config from '../../../../../config';
import { getCompanyId, getToken } from '../../../../../services/asyncStorageService';
import { Insert_report_data } from '../../ReportApi.js'
import {
  COLORS,
  FONTS,
  SIZES,
  dummyData,
  icons,
  images,
} from '../../../../../constants';
import { FormInput, TextButton, HeaderBar } from '../../../../../Components';

const Quantity = ({ project_id }) => {
  const {
    header,
    con_body,
    input,
    body_del,
    body_edit,
    body_del_btn,
    body_edit_btn,
    body_ed_de_view,
    dropdown,
    dropdown1,
    container,
    inputContainer,
    inputsContainer,
    inputfrom,
    inputfromtwo,
    inputfromone,
    cont_Project_list_drop
  } = styles;

  // state
  const [quantityitem, setquantityitem] = useState('');
  const [value, setvalue] = useState(null);
  const [isFocus, setIsFocus] = React.useState(false);
  // modal
  const [additem, setadditem] = useState(false);
  const [reportmodal, setReportmodal] = useState(false);
  const [data, setdata] = useState([]);
  const [reportdata, setReportdata] = useState([]);
  // qtytotal
  // console.log(qtyTotal)

  //Quantity collapse
  const [quant_ity, setQuantity] = useState(false);
  //key states of dynamic inputs
  const [selectKey, setSelectKey] = useState('');
  const [lengthKey, selectLengthkey] = useState('');
  const [widthKey, selectWidthkey] = useState('');
  const [heightKey, selectHeightkey] = useState('');

  //setting Main input data to post
  const [itemData, setItemData] = useState('')
  const [unitData, setUnitData] = useState('')
  const [lengthData, setLengthData] = useState('')
  const [widthData, setWidthData] = useState('')
  const [thicknessData, setThicknessData] = useState('')
  const [totalData, setTotalData] = useState('')
  const [remarkData, setRemarkData] = useState('')

  //sub key states of dynamic inputs
  const [subLengthKey, setSubLengthkey] = useState('');
  const [subWidthKey, setSubWidthkey] = useState('');
  const [subHeightKey, setSubHeightkey] = useState('');



  const [unitKey, setUnitKey] = useState('');

  // const [inputs, setInputs] = useState([
  //   {
  //     select: '',
  //     numlangth: '',
  //     numwidth: '',
  //     numheight: '',
  //     total: '',
  //     Remark: '',
  //   },
  // ]);
  const [inputs, setInputs] = useState([
    {
      select: '', numlangth: '', numwidth: '', numheight: '', total: '', Remark: ''
      , subinputs: [
        // { numlangth: '', numwidth: '', numheight: '', total: '', Remark: '', }
      ]
    }
  ]);
  // const [subInputs, setSubInputs] = useState([
  //   // {
  //   //   sub_numlangth: '',
  //   //   sub_numwidth: '',
  //   //   sub_numheight: '',
  //   //   sub_total: '',
  //   //   sub_remark: ''
  //   // }
  // ])


  const addKeyref = useRef(0);
  //get company id
  const [company_id, setCompany_id] = useState('');
  const [accessTokenoptiontype, setAccessTokenoptiontype] = useState('');

  const _companyId = async () => {
    const _id = await getCompanyId();
    setCompany_id(_id);
  };
  //  console.log(company_id);
  //setting token
  React.useEffect(() => {
    (async () => await _companyId())();
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      setAccessTokenoptiontype(token);
    })();
  });

  const inputkeyRef = useRef(inputs);
  //  inputkey.current.unitname






  const CONST_FIELD = {
    MANPOWER: 'Manpower',
    STOCK: 'Stock',
    QUANTITY: 'Quantity',
    QUALITY: 'Quality',
    TANDP: 'Tandp'
  }
  console.log(CONST_FIELD)

  //Invoking Report data functions in Report api
  const insertQtyPostData = () => {
    //  console.log(inputs);
    console.log(inputs);
    const report_post_data = {
      company_id: company_id,
      project_id: project_id,
      item_id: itemData,
      length: lengthData,
      width: widthData,
      qty: totalData,
      height: thicknessData,
      remark: remarkData
    }

    if (report_post_data) {
      const data = Insert_report_data(report_post_data, CONST_FIELD)
      data.then(res => res.json())
        .then(result => {
          // console.log("report list")
          console.log(result)

          // setReport_list(result)
        })
    } else {
      alert("Not inserted")
    }
  }


  // useMemo(() => {

  // }, [report_post_data])

  const addHandler = () => {

    setInputs([...inputs, {
      select: '', numlangth: '', numwidth: '', numheight: '', total: '', Remark: '',
      subinputs: [
        // { numlangth: '', numwidth: '', numheight: '', total: '', Remark: '' }
      ]
    }]);
  };




  // console.log(inputs);

  // useEffect(() => {
  //   inputs.map((ele, index) => {
  //     if (ele.key === index) {
  //       setSelectData(ele.select)
  //     }
  //   }) 
  // }, [unitname])

  // const selectunitdata = useCallback(()=>{
  //   inputs.map((ele,index)=>{
  //         if(ele.key===index){
  //           setSelectData(ele.select)
  //         }
  //       })
  // },[selectData])



  const deleteHandler = key => {
    // const _inputs = inputs.filter((input, index) => index != key);
    const _inputs = [...inputs]
    _inputs.splice(key, 1);
    setInputs(_inputs);
  };


  function filterOnlyNumericValue(value) {
    return value.replace(/[^0-9]/g, '');
  }

  const inputselect = (item, key) => {
    const _inputselcet = [...inputs];
    _inputselcet[key].select = item;
    _inputselcet[key].key = key;
    // console.log("_inputselcet");
    // console.log(item.unit_name);
    // setSelectKey(_inputselcet);

    setInputs(_inputselcet);
  };




  // console.log(selectData);

  const inputunit = (text, key) => {
    const _inputsunit = [...inputs];
    _inputsunit[key].unit = text;
    _inputsunit[key].key = key;
    setUnitKey(key);
    // console.log("unitKey");
    // console.log(unitKey);
    setInputs(_inputsunit);
  };
  const inputlangth = (text, key) => {
    const _inputlangth = [...inputs];
    _inputlangth[key].numlangth = filterOnlyNumericValue(text);
    _inputlangth[key].key = key;
    // console.log(text)
    setInputs(_inputlangth);
  };
  const inputwidth = (text, key) => {
    const _inputwidth = [...inputs];
    _inputwidth[key].numwidth = filterOnlyNumericValue(text);
    _inputwidth[key].key = key;
    setInputs(_inputwidth);
  };
  const inputhight = (text, key) => {
    const _inputhight = [...inputs];
    _inputhight[key].numheight = filterOnlyNumericValue(text);
    _inputhight[key].key = key;
    setInputs(_inputhight);
  };
  const inputtotal = (value, key) => {
    const _inputtotal = [...inputs];
    _inputtotal[key].total = value;
    _inputtotal[key].key = key;
    setInputs(_inputtotal);
  };

  const inputRemark = (text, key) => {
    const _inputRemark = [...inputs];
    _inputRemark[key].Remark = text;
    _inputRemark[key].key = key;
    setInputs(_inputRemark);
  };
  //for sub dynamic inputs
  const Subinputlangth = (text, index1, key) => {
    const _subinputlangth = [...inputs];
    _subinputlangth[key].subinputs[index1].sub_numlangth = filterOnlyNumericValue(text);
    _subinputlangth[key].subinputs[index1].key = key;
    // setSubInputs(_subinputlangth);
    setInputs(_subinputlangth);
  };
  const Subinputwidth = (text, index1, key) => {
    const _subinputwidth = [...inputs];
    _subinputwidth[key].subinputs[index1].sub_numwidth = filterOnlyNumericValue(text);
    _subinputwidth[key].subinputs[index1].key = key;
    setInputs(_subinputwidth);
  };
  const Subinputhight = (text, index1, key) => {
    const _subinputhight = [...inputs];
    _subinputhight[key].subinputs[index1].sub_numheight = filterOnlyNumericValue(text);
    _subinputhight[key].subinputs[index1].key = key;

    setInputs(_subinputhight);
  };
  const Subinputtotal = (value, index1, key) => {
    const _subinputtotal = [...inputs];
    _subinputtotal[key].subinputs[index1].sub_total = value;
    _subinputtotal[key].subinputs[index1].key = key;
    setInputs(_subinputtotal);
  };

  const SubinputRemark = (text, index1, key) => {
    const _subinputRemark = [...inputs];
    _subinputRemark[key].subinputs[index1].sub_Remark = text;
    _subinputRemark[key].subinputs[index1].key = key;

    setInputs(_subinputRemark);
  };

  //close of sub dynamic inputs




  const fetchData = async () => {
    const resp = await fetch(`${config.API_URL}unit`);
    const data = await resp.json();
    //  console.log(data);
    setdata(data);
  };
  // get data api list

  useEffect(() => {
    fetchData();
  }, []);

  const saveItems = () => {
    const quantityworkitem = {
      item_name: quantityitem,
      unit_id: value,
      company_id: company_id,
    };
    try {
      fetch(`${config.API_URL}quantity-report-item`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantityworkitem),
      })
        .then(response => response.json())
        .then(data => {
          setvalue('');
          setquantityitem('');
          reportdataitem();
          console.log('Success:', data);
        });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const reportdataitem = async () => {
    try {
      const resp = await fetch(
        `${config.API_URL}quantity-report-item/` + `${company_id}`,
      );
      const quantitydata = await resp.json();
      // console.log(quantitydata);
      setReportdata(quantitydata);
    } catch (error) {
      console.log(error, 'error');
    }
  };
  useEffect(() => {
    reportdataitem();
  }, []);

  // const moreItembox=()=>{
  //  alert('')
  // }

  const add_quantity_icon_button = () => {
    return (
      <TouchableOpacity
        style={{
          // backgroundColor: COLORS.white,
          borderRadius: SIZES.radius * 0.2,
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: 2,

        }}
        onPress={() => {
          // LayoutAnimation.easeInEaseOut();
          // addInput()
          setReportmodal(true);
        }}>
        <View style={{
          alignSelf: "center",
          alignItems: "center",
          position: "absolute",
          justifyContent: "space-evenly",
          flexDirection: "row",
          backgroundColor: COLORS.lightblue_400,
          padding: SIZES.base * 0.1,
          paddingHorizontal: 2,
          paddingVertical: -2,
          borderRadius: 5,
          top: -SIZES.base * 1.2,

        }}>
          <View>
            <Text style={[FONTS.body5, { color: COLORS.white }]}>Add</Text>
          </View>
          <View>
            <MaterialIcons
              name='add'
              size={15}
              color={COLORS.white}
            />
          </View>
          {/* <Text style={{color:COLORS.gray}}>Add Quantity item</Text> */}


        </View>
      </TouchableOpacity>
    )
  }

  const add_inside_handler = (key, e) => {
    let takekey = key;
    addKeyref.current = takekey;
    const _inputs = [...inputs];
    _inputs[key].subinputs.push({
      sub_numlangth: '',
      sub_numwidth: '',
      sub_numheight: '',
      sub_total: '',
      sub_Remark: '',
    });

    setInputs(_inputs)

  }

  const delete_inside_Handler = (key, index1) => {
    let _sub_inputs = [...inputs];
    // const _sub_inputs = subInputs.filter((input, index) => index != key);
    _sub_inputs[key].subinputs.splice(index1, 1);
    // setSubInputs(_sub_inputs);
    setInputs(_sub_inputs)

  };


  const add_subinput_field = (index1, key, subinputs) => {

    return (
      <View
        key={index1}
        style={{ borderWidth: 2, padding: 5, margin: 4, borderColor: "green" }}
      >
        {/* <Text style={{ color: COLORS.black }}>{index1}</Text> */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between"
          }}>

          <TextInput
            style={inputfromone}
            placeholder="SubLength"
            placeholderTextColor={COLORS.gray}
            value={subinputs.sub_numlangth}
            keyboardType="numeric"
            onChangeText={text => {
              setSubLengthkey(subinputs.key)
              Subinputlangth(text, index1, key);
            }}
          />
          <TextInput
            style={inputfromone}
            placeholder="SubWidth"
            placeholderTextColor={COLORS.gray}
            value={subinputs.sub_numwidth}
            keyboardType="numeric"
            onChangeText={text => {
              setSubWidthkey(subinputs.key)
              Subinputwidth(text, index1, key);
            }}
          />
          <TextInput
            style={inputfromone}
            placeholder="SubThickness"
            placeholderTextColor={COLORS.gray}
            value={subinputs.sub_numheight}
            keyboardType="numeric"
            onChangeText={text => {
              setSubHeightkey(subinputs.key)
              Subinputhight(text, index1, key);
            }}
          />
          <TextInput
            style={inputfromtwo}
            editable={false}
            selectTextOnFocus={false}
            placeholderTextColor={COLORS.white}
            placeholder={'Total'}
            value={index1 == subLengthKey == subWidthKey == subHeightKey ? (subinputs.sub_numlangth * subinputs.sub_numwidth * subinputs.sub_numheight).toString() : (subinputs.sub_numlangth * subinputs.sub_numwidth * subinputs.sub_numheight).toString()}
            keyboardType="numeric"
            onChangeText={value => {
              Subinputtotal(value, index1, key);
              console.log(value)
            }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <TextInput
              style={{
                width: '450%',
                borderWidth: 1,
                height: 30,
                padding: -6,
                paddingLeft: 5,
                // marginBottom: 5,
                borderRadius: 5,
                marginLeft: 5,
                color: COLORS.black,
                borderColor: COLORS.gray,
                flexWrap: 'wrap',
              }}
              placeholder={'Remark'}
              placeholderTextColor={COLORS.gray}
              value={subinputs.sub_Remark}
              onChangeText={text => SubinputRemark(text, index1, key)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => delete_inside_Handler(key, index1)}>
              <Image
                source={icons.delete_icon}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.green,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  const add_qty_data_modal = () => {
    return (
      <View>
        <Modal visible={reportmodal} transparent={false} animationType="slide">
          <View style={{ flex: 1, backgroundColor: '#000000aa', padding: 10 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                marginTop: 50,
                borderRadius: 20,
                padding: 22,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  justifyContent: 'space-between',
                }}>
                <Title>Add Quantity Data</Title>
                <Pressable onPress={setReportmodal}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{ borderWidth: 1, borderRadius: 5, borderColor: COLORS.gray, paddingHorizontal: 2, marginVertical: 2 }}
                  onPress={() => {
                    addHandler();
                    // selectunitdata();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 1
                    }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.darkGray }}>Add</Text>
                    <MaterialIcons
                      name="add-box"
                      size={20}
                      color={COLORS.green}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderWidth: 1, borderRadius: 2, paddingVertical: 1, marginVertical: 3,
                    paddingHorizontal: 4
                  }}
                  onPress={() => {
                    setadditem(true);
                  }}>
                  <Text style={{ ...FONTS.h3, color: COLORS.darkGray }}>Add ITEM</Text>
                </TouchableOpacity>
              </View>
              <View style={container}>
                <ScrollView style={inputsContainer}>
                  {inputs ? inputs.map((input, key) => {
                    {/* console.log(inputs.length) */ }
                    return (
                      <View style={inputContainer} key={key}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // alignItems: 'center',
                          }}
                          // key={key}
                          key="{(key+1)}"
                        >
                          <Dropdown
                            style={[
                              styles.dropdown,
                              // cont_Project_list_drop,
                              isFocus && { borderColor: 'blue' },
                            ]}
                            selectedTextStyle={{ color: COLORS.gray, }
                            }
                            placeholderStyle={{ fontSize: 16, color: COLORS.darkGray, left: 5 }}
                            inputSearchStyle={{ color: COLORS.gray, height: 40, borderRadius: 5, padding: -5 }}
                            data={reportdata}
                            search
                            maxHeight={300}
                            labelField="item_name"
                            valueField="_id"
                            placeholder={!isFocus ? 'Select' : '...'}

                            searchPlaceholder="Search..."
                            value={input.value}
                            onChange={item => {
                              setSelectKey(input.key);
                              setItemData(item._id)
                              setUnitData(item.unit_name)
                              // console.log(item._id)
                              inputselect(item, key);
                            }}
                          />
                          <TextInput
                            style={inputfromtwo}
                            // editable={false}
                            selectTextOnFocus={false}
                            placeholder={'unit'}

                            // value={key==selectKey?input.select.unit_name:selectKey==unitKey?input.select.unit_name:null}
                            value={key == selectKey ? input.select.unit_name : input.select.unit_name}
                            onChangeText={text => { inputunit(text, key) }}
                          />



                          <TouchableOpacity
                            key={key}
                            onPress={(e) => {

                              add_inside_handler(key, e)
                            }}>
                            <MaterialIcons
                              name="add-box"
                              size={25}
                              color={COLORS.darkBlue}
                              style={{ alignItems: 'center' }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TextInput
                            style={inputfromone}
                            placeholder="Length"
                            placeholderTextColor={COLORS.black}
                            value={input.numlangth}
                            keyboardType="numeric"
                            onChangeText={text => {
                              selectLengthkey(input.key)
                              setLengthData(text)
                              // console.log(text)
                              inputlangth(text, key);
                            }}
                          />
                          <TextInput
                            style={inputfromone}
                            placeholder="Width"
                            placeholderTextColor={COLORS.black}
                            value={input.numwidth}
                            keyboardType="numeric"
                            onChangeText={text => {
                              selectWidthkey(input.key)
                              setWidthData(text)
                              inputwidth(text, key);
                            }}
                          />
                          <TextInput
                            style={inputfromone}
                            placeholder="Thickness"
                            placeholderTextColor={COLORS.black}
                            value={input.numheight}
                            keyboardType="numeric"
                            onChangeText={text => {
                              selectHeightkey(input.key)
                              setThicknessData(text)
                              setTotalData(input.total)
                              // console.log(text)
                              inputhight(text, key);
                            }}
                          />
                          <TextInput
                            style={inputfromtwo}
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={COLORS.white}
                            placeholder={'Total'}
                            value={key == lengthKey == widthKey == heightKey ? (input.total=input.numlangth * input.numwidth * input.numheight).toString() : (input.total=input.numlangth * input.numwidth * input.numheight).toString()}
                            keyboardType="numeric"
                            onChangeText={value => {
                              
                              inputtotal(value, key);
                            }}
                          />

                        </View>
                        <TextInput
                          style={{
                            width: '90%',
                            borderWidth: 1,
                            height: 30,
                            padding: -6,
                            paddingLeft: 5,
                            marginBottom: 5,
                            borderRadius: 5,
                            marginLeft: 5,
                            color: COLORS.gray,
                            borderColor: COLORS.gray,
                            flexWrap: 'wrap',
                          }}
                          placeholder={'Remark'}
                          placeholderTextColor={COLORS.gray}
                          value={input.Remark}
                          onChangeText={text => {
                            setRemarkData(text);
                            inputRemark(text, key)
                          }}
                        />



                        <View>
                          {

                            inputs[key].subinputs.map((subinputs, index1) => {
                              return (
                                add_subinput_field(index1, key, subinputs)
                              )
                            })

                          }
                          <View style={{ alignSelf: "flex-end" }}>
                            <TouchableOpacity
                              style={{ alignSelf: "flex-end" }}
                              onPress={() => deleteHandler(key)}>
                              <Image
                                source={icons.delete_icon}
                                style={{
                                  width: 20,
                                  height: 20,
                                  tintColor: COLORS.red,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )
                  }) : null}
                </ScrollView>
              </View>
              <View style={{ marginTop: 10 }}>
                <Button
                  title="submit"
                  onPress={() => {
                    insertQtyPostData();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  const add_item_modal = () => {
    return (
      <View>
        <Modal transparent={false} visible={additem} animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
              // justifyContent: 'center',
            }}>
            <View
              style={{
                // flex: 1,
                backgroundColor: '#fff',
                marginTop: 80,
                padding: 20,
                borderRadius: 20,
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // borderBottomWidth: 1,
                }}>
                <Text style={{ ...FONTS.h2, color: COLORS.darkGray }}>Quantity item</Text>
                <Pressable onPress={setadditem}>
                  <AntDesign name="close" size={30} color={COLORS.black} />
                </Pressable>
              </View>
              <View style={{ marginTop: 20 }}>
                <FormInput
                  label="Name"
                  onChange={quantityitem => {
                    setquantityitem(quantityitem);
                  }}
                />
                <Dropdown
                  style={[dropdown1, isFocus && { borderColor: 'blue' }]}
                  data={data}
                  search
                  maxHeight={300}
                  labelField="unit_name"
                  valueField="_id"
                  placeholder={!isFocus ? 'Select' : '...'}
                  placeholderStyle={{ fontSize: 16, color: COLORS.darkGray, left: 5 }}
                  selectedTextStyle={{ color: COLORS.gray, }
                  }
                  inputSearchStyle={{ color: COLORS.gray, height: 40, borderRadius: 5, padding: -5 }}
                  value={value}
                  searchPlaceholder="Search..."
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setvalue(item._id);
                    // setunitname(item.unit_name);
                    setIsFocus(false);
                  }}
                />
              </View>
              <View>
                <TextButton
                  label="save"
                  buttonContainerStyle={{
                    height: 45,
                    borderRadius: SIZES.radius,
                    marginTop: SIZES.padding,
                  }}
                  onPress={() => {
                    saveItems();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  return (
    <View>
      {/* Quantity */}
      <Pressable
        onPress={() => setQuantity(!quant_ity)}
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.base,
          paddingVertical: 3,
          width: SIZES.width * 0.35,
          alignItems: 'center',
          justifyContent: 'space-between',
          top: SIZES.base * 2,
          borderColor: COLORS.lightblue_200,
          borderWidth: 1,
          borderRadius: 1,
          elevation: 1,
        }}>
        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
          <Text
            onPress={() => setQuantity(!quant_ity)}
            style={[FONTS.h3, { color: COLORS.darkGray }]}>
            Quantity
          </Text>
        </View>
        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
          <TouchableOpacity onPress={() => setQuantity(!quant_ity)}>
            <AntDesign name="caretdown" size={12} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </Pressable>
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          right: SIZES.base * 2,

        }}
      >
        {/* button section adding contractor */}
        {quant_ity ?
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }} >
            <View style={{ backgroundColor: "blue" }}>
              {add_quantity_icon_button()}
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "skyblue",
                width: SIZES.width * 0.92,
                alignSelf: "flex-start",
                // position:"absolute",
                top: 20,
                marginLeft: 17,
                // marginBottom: -20,
                padding: 5,
                elevation: 1
              }}>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                <View style={{}}>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>S.no</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>01</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Item</Text>
                  </View>
                  <View style={{ borderRightWidth: 1, paddingHorizontal: 15, marginLeft: -15, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>02</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Length</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>03</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Breadth</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>04</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Thickness</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>05</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Quantity</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>06</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Unit</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>07</Text>
                  </View>
                </View>
                <View>
                  <View style={{}}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>Remark</Text>
                  </View>
                  <View style={{ borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 5, borderColor: COLORS.lightGray1 }}>
                    <Text style={{ ...FONTS.h5, color: COLORS.darkGray }}>08</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
          : null}
      </View>
      {add_qty_data_modal()}
      {add_item_modal()}
    </View>
  );
};

export default Quantity;
