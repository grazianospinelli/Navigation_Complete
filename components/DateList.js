import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import moment from "moment";

convertDate = (date) => {
  moment(date, 'YYYY-MM-DD', true).isValid();
  return moment(date).format("DD-MM-YYYY");
}

const ListItem = props => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <Text> {this.convertDate(props.dateNum)} </Text>
      {/* <View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />      */}
    </View>
  </TouchableOpacity>
);

const dateList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.dates}
      keyExtractor={(item) => item.comID.toString()}
      renderItem={(info) => (
        <ListItem
          dateNum={info.item.comDate}
          onItemPressed={() => props.onItemSelected(info.item.comID)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  },
  listItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center"
  },
});

export default dateList;
