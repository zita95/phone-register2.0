const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    database: 'phones'
  }
});

const stdin = process.stdin;
stdin.setRawMode(true);
const readline = require('readline-sync');
const table = require('table').table;

const makeDecision = async () => {
  const choices = ['LIST RECORDS', 'SEARCH NAME', 'REGISTER NUMBER', 'CHANGE NUMBER', 'DELETE NUMBER'];
  const index = readline.keyInSelect(choices, 'What would you like to do?');
  console.log(choices[index]);
  if (choices[index] === 'LIST RECORDS') {
    await listRecords();
    process.exit();
  }
  if (choices[index] === 'REGISTER NUMBER') {
    await registerNumber();
  }
  if (choices[index] === 'DELETE NUMBER') {
    await deleteNumber();
  }
  if (choices[index] === 'CHANGE NUMBER') {
    await changeNumber();
  }
  if (choices[index] === 'SEARCH NAME') {
    await searchByName();
  }
  if (readline.keyIn === 'q') {
    process.exit();
  }
};

const listRecords = async () => {
  const phoneBook = [
    [
      'Name',
      'Number'
    ]
  ];
  const records = await knex.select('Name', 'Number').from('Numbers');
  for (const record of records) {
    phoneBook.push([
      record.Name,
      record.Number
    ]);
  }
  console.log(table(phoneBook));
};

const registerNumber = async () => {
  const input1 = readline.question('Please enter the NAME: ');
  const input2 = readline.question('Please enter the NUMBER: ');
  const newRecords = [
    { Name: input1, Number: input2 }
  ];
  for (const record of newRecords) {
    await knex('Numbers').insert(record);
  }
};

const changeNumber = async () => {
  const oldNumber = readline.question('Number to change: ');
  const newNumber = readline.question('New number: ');
  const sure = readline.keyInYN("Are you sure it's the right number?");
  if (sure) {
    await knex('Numbers').where('Numbers.Number', oldNumber).update({ 'Numbers.Number': newNumber });
  } else {
    changeNumber();
  }
};

const searchByName = async () => {
  const lookingFor = readline.question('NAME you are looking for: ');
  const result = [
    [
      'Name',
      'Number'
    ]
  ];
  const data = await knex('Numbers').where({ 'Numbers.Name': lookingFor });
  for (const record of data) {
    result.push([
      record.Name,
      record.Number
    ]);
  }
  console.log(table(result));
};

const deleteNumber = async () => {
  const recordToDelete = readline.question('Number to delete number: ');
  const sure = readline.keyInYN('Are you sure?');
  if (sure) {
    await knex('Numbers').where('Numbers.Number', recordToDelete).del();
  } else {
    deleteNumber();
  }
};

makeDecision();


