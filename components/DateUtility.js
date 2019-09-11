import moment from 'moment';

export const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
export const weekday = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

export const convertDate = (date) => {
  moment(date, 'YYYY-MM-DD', true).isValid();
  return moment(date).format('DD-MM-YYYY');
};
export const getWeekDay = date => (weekday[parseInt(moment(date).format('d'))]);
export const getYear = date => (date.split('-', 1));
export const getMonth = date => (months[parseInt(date.split('-')[1]) - 1]);
export const isSameMonth = (date1, date2) => getMonth(date1) === getMonth(date2);
export const isSameYear = (date1, date2) => getYear(date1) === getYear(date2);
