function Validate(kindOfField, value) {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (kindOfField === 'notEmpty') {
    if (value === '') {
      return '↑ Prego inserire il Dato';
    }
    return '';
  }
  if (kindOfField === 'email') {
    if (value === '') {
      return '↑ Prego inserire Email';
    }
    if (reg.test(value) === false) {
      return '↑ Email non è corretta';
    }
    return '';
  }
  if (kindOfField === 'password') {
    if (value === '') {
      return '↑ Prego inserire la Password';
    }
    if (value.length < 8) {
      return '↑ Password deve essere almeno 8 caratteri';
    }
    return '';
  }
}

export default Validate;
