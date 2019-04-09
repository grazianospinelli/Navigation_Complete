import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import * as Colors from '../components/themes/colors';

const separator = () => (<View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />);

const months = ['Gennaio','Febbraio','Marzo','Aprile', 'Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const weekday = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

convertDate = (date) => {
  moment(date, 'YYYY-MM-DD', true).isValid();
  return moment(date).format("DD-MM-YYYY");
}
getWeekDay = (date) => (weekday[parseInt(moment(date).format('d'))]);
getYear = (date) => (date.split('-',1));
getMonth = (date) => (months[parseInt(date.split('-')[1])-1]);
isSameMonth = (date1,date2) => {return getMonth(date1) === getMonth(date2)};
isSameYear = (date1,date2) => {return getYear(date1) === getYear(date2)};

const ListItem = props => (
    <TouchableOpacity key={props.keyc} onPress={props.onItemPressed}>
      <View style={styles.listItem}>
        <View style={styles.showDay}>
          <Text style={{fontSize: 25, color: '#fff',}}> {props.dateNum.split('-')[2]} </Text>
          <Text style={{color: '#fff'}}> {this.getWeekDay(props.dateNum)} </Text>
        </View>
        <View style={styles.showJob}>
        <Text style={{fontSize: 15}}> {props.dateRes} </Text>
        </View>
      </View>
    </TouchableOpacity>
)

// Al modulo dateList viene passato:
// - props.dates  
// - props.onItemSelected

const dateList = props => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.showMonth}>
        <Text style={styles.showText}>
          {getMonth(props.dates[0].comDate)} 
          {' ' + getYear(props.dates[0].comDate)}
        </Text>
      </View>
    
      {
        props.dates.map((item, index, array) => {
          if (index < array.length-1) { 
              if (isSameMonth(item.comDate,array[index+1].comDate)) { 
              return (<ListItem
                        dateNum={item.comDate}
                        dateRes={item.resName}
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
                        dateRes={item.resName}
                        onItemPressed={() => props.onItemSelected(item.comID)}
                        keyc={item.comID}
                    />
                    <View style={styles.showMonth}>
                      <Text style={styles.showText}>
                        {getMonth(array[index+1].comDate)}
                        {' ' + getYear(array[index+1].comDate)}
                      </Text>
                    </View>
                  </View>  
                )
              }
          }
          else {
            // Renderizza l'ultimo elemento della lista
            return (<ListItem
              dateNum={item.comDate}
              dateRes={item.resName}
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
  listContainer: {
    width: "100%",    
  },
  showMonth: {
    width: "100%",
    height: 35,
    marginBottom: 5,    
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  showText: {
    color: '#fff',
    fontSize: 18,
  },
  listItem: {
    flexDirection: "row",  
    width: "100%",
    marginBottom: 5,  
  },
  showDay: {
    width: '20%',
    height: 55,
    backgroundColor: Colors.grey2,    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showJob: 
  {
    width: '80%',
    height: 55,
    backgroundColor: Colors.grey5,    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default dateList;
