// To validate the password requirements

function CheckPassword(inputtxt) { 
var paswd=  "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/";
if(inputtxt.value.match(paswd)) 
{ 
alert('Correct, try another...')
return true;
}
else
{ 
alert('Wrong...!')
return false;
}
} 

function trying(){
    alert("hi");
}

alert("hi");
console.log("hi");