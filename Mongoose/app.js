const fs = require('fs');

var name = 'Yenum';
var age = 29;
var hasHobby = true;

function userSummary(userName, userAge, userHasHobby) {
    return (
        'Username is ' + 
        userName +
        ', Age is ' + 
        userAge +
        ', User has hobby: ' + 
        userHasHobby
    );
}

fs.writeFileSync('Welcome.txt',userSummary(name,age,hasHobby));
console.log(userSummary(name, age, hasHobby));
// console.log('Welcome to Node JS');