import React, { Component } from 'react';
import { View } from 'react-native';
import { TextField } from "react-native-material-textfield";
import Icon from "react-native-vector-icons/Ionicons";

const IconTextField = (props) => (
    <View>
      <TextField
        {...props}
        labelTextStyle={{ paddingLeft: 32 }}
        inputContainerStyle={{ paddingLeft: 32 }}
        containerStyle={{ height: 70 }}
      />
      <Icon style={{
        position: 'absolute',
        top: 34,
        left: 0,
      }} size={20} name={props.iconName} />
    </View>
)

export default IconTextField