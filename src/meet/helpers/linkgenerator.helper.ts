
const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
const size = 12;

export const generateLink = () => {
  let randomString = '';
  for (let i = 0; i < size; i++) {
    if(i === 3 || i === 8){
      randomString += '-';
    }else{
      let rnum = Math.floor(Math.random() * chars.length);
      randomString += chars.substring(rnum, rnum + 1);
    }
  }

  return randomString;
}