import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import moment from "moment";
import * as Colors from '../components/themes/colors';

convertDate = (date) => {
  moment(date, 'YYYY-MM-DD', true).isValid();
  return moment(date).format("DD-MM-YYYY");
}

const months = ['Gennaio','Febbraio','Marzo','Aprile', 'Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const weekday = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

const separator = () => (<View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />);

getYear = (date) => (date.split('-',1));
getMonth = (date) => (months[parseInt(date.split('-')[1])-1]);
isSameMonth = (date1,date2) => {return getMonth(date1) === getMonth(date2)};
isSameYear = (date1,date2) => {return getYear(date1) === getYear(date2)};

const ListItem = props => (
  // chiave inserita per evitare warning
  <TouchableOpacity key={props.keyc} onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <Text > {this.convertDate(props.dateNum)} </Text>
    </View>
  </TouchableOpacity>
);

// Al modulo dateList viene passato:
// props.dates - props.onItemSelected

const dateList = props => {
  return (
    <View style={styles.listContainer}>
    <Text style={styles.showMonth}>
      {getMonth(props.dates[0].comDate)} 
      {' ' + getYear(props.dates[0].comDate)}
    </Text>
    
      {
        props.dates.map((item, index, array) => {
          if (index < array.length-1) { 
              if (isSameMonth(item.comDate,array[index+1].comDate)) { 
              return (<ListItem
                        dateNum={item.comDate}
                        onItemPressed={() => props.onItemSelected(item.comID)}
                        key={item.comID}
                      />)
              }
              else {
                return (
                  // chiave inserita per evitare warning
                  // Utilizzato view per wrappare i 2 oggetti poichè map 
                  // deve restituire comunque un unico elemento
                  <View key={item.comID}>               
                    <ListItem
                        dateNum={item.comDate}
                        onItemPressed={() => props.onItemSelected(item.comID)}
                        keyc={item.comID}
                    />
                    <Text style={styles.showMonth}>
                      {getMonth(array[index+1].comDate)}
                      {' ' + getYear(array[index+1].comDate)}
                    </Text>
                  </View>  
                )
              }
          }
          else {
            // Renderizza l'ultimo elemento della lista
            return (<ListItem
              dateNum={item.comDate}
              onItemPressed={() => props.onItemSelected(item.comID)}
              key={item.comID}
            />)
          }
        })
      }
    </View>
  );
};


const styles = StyleSheet.create({
  showMonth: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    color: '#fff',
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center"
  },
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
