import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import moment from "moment";
import * as Colors from '../components/themes/colors';

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

const RingsImage = () => (
  <Image source={require('../components/images/notebook_rings.jpg')} style={{width: 50, height: 50, marginRight: 10 }} resizeMode='contain' />
);

const Separator = () => (<View style={{ width: '100%', height: 1, backgroundColor: Colors.grey4, marginTop: 25 }} />);

const ListItem = props => (
  
    
      <View key={props.keyc} style={styles.listItem}>
        <View style={styles.showRings}>
          <RingsImage />
          <RingsImage />
          <RingsImage />
        </View>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.showDay}>
              <Text style={{fontSize: 25, color: '#fff',}}> {props.dateNum.split('-')[2]} </Text>
              <Text style={{color: '#fff'}}> {this.getWeekDay(props.dateNum)} </Text>
            </View>
            <TouchableOpacity onPress={props.onItemPressed} style={styles.showJob}>
                <View>
                    <Text style={{fontFamily: 'Abecedary', fontSize: 15}}> {props.dateRes} </Text>
                </View>
            </TouchableOpacity>
          </View>
          <Separator />
        </View>
        
      </View>
    
)

// Al modulo dateList viene passato:
// - props.dates  
// - props.onItemSelected

const dateList = props => {
  if (props.dates == 'EMPTY') {
    return (
      <View style={styles.listContainer}>
          <Text>Nessun Impegno</Text>
      </View>
    )
  }
  else {
  return (
    <View style={styles.listContainer}>
      
      <View style={styles.showMonth}>
        <RingsImage />
        <Text style={styles.showTextMonth}>
          {getMonth(props.dates[0].comDate)} 
          {' ' + getYear(props.dates[0].comDate)}
        </Text>
      </View>
    
      {
        // Prima di ciclare sull'array con map abbiamo renderizzato il separatore
        // mese e anno tratti dal primo elemento: props.dates[0]
        // Nel ciclo verifichiamo quando il mese cambia da un elemento all'altro
        // con isSameMonth confrontando l'elemento corrente item con il successivo
        // array[index+1] e se cambia andiamo a renderizzare il separatore mese+anno
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
                      <RingsImage />
                      <Text style={styles.showTextMonth}>
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
  }

};


const styles = StyleSheet.create({
  listContainer: {
    width: "100%",       
  },
  showMonth: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    marginBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'center', 
    // borderBottomColor: 'red',
    // borderBottomWidth: 2,
  },
  showTextMonth: {
    color: Colors.primary,
    fontWeight: 'bold',
    // textShadowColor: Colors.grey2,
    // textShadowRadius: 5,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  listItem: {
    flexDirection: "row",  
    width: "100%",
    height: 150,   
  },
  showRings: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: 150,
  },
  showDay: {
    width: 55,
    height: 55,
    backgroundColor: Colors.grey2,    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',    
  },
  showText: {
    color: '#fff',
    fontSize: 18,
  },
  showJob: 
  {
    // flex: 1,
    width: '70%',
    height: 100,
    backgroundColor: Colors.grey5,    
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderColor: Colors.grey4,
    borderWidth: 2,
    marginLeft: 8,    
  },

});

export default dateList;