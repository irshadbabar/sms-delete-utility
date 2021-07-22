// const Data = [
//   {id: 1, text: 'Item 1'},
//   {id: 2, text: 'Item 2'},
//   {id: 3, text: 'Item 3'},
//   {id: 4, text: 'Item 4'},
//   {id: 5, text: 'Item 5'},
//   {id: 6, text: 'Item 6'},
//   {id: 7, text: 'Item 7'},
//   {id: 8, text: 'Item 8'},
//   {id: 9, text: 'Item 9'},
//   {id: 10, text: 'Item 10'},
// ];

const SMSData = [];

for (let index = 1; index < (5 + Math.random() * 100); index++) {
  SMSData.push({
    id: index,
    date: "",
    read: "",
    status: "",
    body: "Hello Message",
    seen: "",
    address: "+923407072712",
  });
}

export default SMSData;
