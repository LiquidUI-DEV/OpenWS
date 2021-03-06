/*******************************************************************************************
****Description		: 		This file is used load generica functions that can be called 
****						from multiple functions
****Author			:		Synactive Inc
*******************************************************************************************/


function isBlank(jvar){
	if(typeof jvar == undefined || jvar == null || jvar == "" || jvar == void 0)
		return true;
	else
		return jvar.toString().trim() == '';
}


//Variant of isBlank.. additionally checks for ? in case of required fields
function isNot(jvar){ 
	if(typeof jvar == undefined || jvar == null || jvar == "" || jvar == void 0)
		return true;
	else
		return jvar.toString().trim() == '' || jvar.toString().trim() == '?';
}

function trim(jvar){
	if(typeof jvar == undefined || jvar == null || jvar == "" || jvar == void 0)
		return '';
	else
		return jvar.toString().trim();
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

Array.prototype.indexOf = function (p){
	for(i=0;i<this.length;i++)	if(this[i] == p) return i;
	return -1;
}

Array.prototype.find = function (p){
	for(i=0;i<this.length;i++)	if(this[i] == p) return true;
	return false;
}

//Check if a matching value exists in the array for a key
Array.prototype.match = function (key, value){
	for(i=0;i<this.length;i++) if(this[i][key] == value) return i;
	return -1;
}

Array.prototype.print = function(){
	for(var r in this){
		for(var c in this[r])
			println("Array element:" + this[r][c]);
	}
}

//Returns a new array with the type specified
//type: 1 - push the element into the return array
//type: 2 - push the index into the return array
Array.prototype.allindex = function(match,type){
	var arr = [];
	for(element in this){
		if(this[element] == match){
			if(type == 1) arr.push(this[element]);
			else if(type == 2) arr.push(element);
			else arr.push(this[element]);
		}
	}
	return arr;
}

//Returns the updated array with the deleted index element
Array.prototype.del = function(index){
	if(this.length>0){
		if(index == 0){
			if(this.length>1) return this.slice(1,this.length);
			else return [];
		}
		else
			return this.slice(0,index).concat(this.slice(index+1,this.length));
	}
	else return [];
}
const PADDING_LEFT = 0;
const PADDING_RIGHT = 1;
function padString(source,length,direction,character) {
	var loop;
	var output = "";
	var sourceLength = 0;
	set('V[z_source]',source);
	if(z_source) {
		sourceLength = z_source.length;
	}
	
	switch(direction) {
	case PADDING_LEFT:
		for(loop = 0; loop < (length - sourceLength); loop++) {
			output += character;
		}
		output = output + z_source;
		break;
		
	case PADDING_RIGHT:
		for(loop = 0; loop < (length - sourceLength); loop++) {
			output += character;
		}
		output = z_source + output;
		break;
	}
	return output;
}

function isErrMsg(msg){
	return msg.substring(0,2) == 'E:';
}

if(isBlank(requiredArr))
	requiredArr = [];
	
function required(obj){
	if(!requiredArr.find(obj))
		requiredArr.push(obj);
	for(i=0;i<requiredArr.length;i++){
		set('V[tmp]','&'+requiredArr[i].field);
		if(!tmp) return false;
	}	
	return true;
}


Array.prototype.match_history = function (){
	var returnValue = true;
	for(var n=0;n<this.length;n++){
		set('V[z_va01_tmpnew]','&V['+this[n]+']');
		set('V[z_va01_tmpold]','&V['+this[n]+'_old]');
		if(z_va01_tmpnew.trim() != z_va01_tmpold.trim()){
			returnValue = false;
			break;
		}
	}
	return returnValue;
}

Array.prototype.clear_history = function (){
	var returnValue = true;
	for(var n=0;n<this.length;n++){
		set('V['+this[n]+']','');
		set('V['+this[n]+'_old]','');
	}
	return;
}

Array.prototype.historize = function (){
	for(var n=0;n<this.length;n++){
		set('V[z_va01_tmpnew]','&V['+this[n]+']');
		set('V['+this[n]+'_old]','&V['+this[n]+']');
	}
}

function split_string(string,space){
	var tmpArr = [];
	var start = 0;
	var tempspace=0;
	var tmpstring ='';
	if(string && string.length>0){
		var end = string.length;
		if(end <=space){
			tmpArr.push(string);
		}
		else {
			while(start < end){
				tempspace = ((start+space)<end)?(start+space):end;
				tmpstring = string.substring(start,tempspace);
				tmpArr.push(tmpstring);
				start = tempspace;
			}
		}
	}
	return tmpArr;
}

function DateDiff(date1, date2) {
	var datediff = Math.abs(date1.getTime() - date2.getTime()); // difference 
    return (datediff / (1000)); //Convert values days and return value      
}

/*
	Function to set the variable to true
	set_variable(<variable_name>);
*/
function set_variable(param){
	set('V['+param.variable+']','X');
}

// Start insert US088757 May 20


function readUserDefaults() {
	onscreen 'SAPLSUU5.0100'
		enter('=DEFA');
		
	onscreen 'SAPLSUU5.0100'
		set('V[USERDECIMALFORMAT]','&F[USDEFAULTS-DCPFM]'); //Decimal notation
		enter('/n');
}

function readRFCUserDefaults(){
	call ("BAPI_USER_GET_DETAIL",{"in.USERNAME":"<rfcuser>", "out.DEFAULTS":"z_defaults"});
	decimalformat = z_defaults.substring(28,29);
}

//This Function converts the user decimal format in SAP to a general decimal format (xxxxxx.xx)
function decimalNotationFormat(numberFormat,number,nDec){
	var str = "";

	if(nDec == void 0)	// Default for number of decimal places
		nDec = 2;
		
	switch(numberFormat)
	{
	case 'X':
		{
			str = number.replace(/\,/g, '');		// Replace , with nothing
		}
		break;
	case 'Y':
		{
			str = number.replace(/\s+/g,'');		// Remove Blank Spaces
			str = str.replace(/\,/g, '.');			// Replace , with .
		}
		break;
	default:
		{
			str = number.replace(/\./g, '');		// Replace . with nothing
			str = str.replace(/\,/g, '.');			// Replace , with .
		}
		break;
	}
	// return parseFloat(str.trim()).toFixed(3);
	return str;
}

//This Function converts the general decimal format to user decimal format in SAP
function userSAPDecimalFormat(nStr,nSeparator){

	var fStr = nStr.replace(/\,/g, '');

	var str = fStr.split('.');
    var offset = str[0].length % 3;
	//println("\n\n" + str[0] + "\n\n");

	if(nSeparator == ' ')
		str[0] = str[0].substring(0, offset) + str[0].substring(offset).replace(/([0-9]{3})/g, ".$1");
	if(nSeparator == 'X')
		str[0] = str[0].substring(0, offset) + str[0].substring(offset).replace(/([0-9]{3})/g, ",$1");
	if(nSeparator == 'Y')
		str[0] = str[0].substring(0, offset) + str[0].substring(offset).replace(/([0-9]{3})/g, " $1");
	
	if(offset == 0) 
		str[0] = str[0].substring(1,str[0].length);

	if(nSeparator == 'Y' || nSeparator == ' ') {
		return str.join(',');
	} else {
		return str.join('.');
	}		
}	

// This Function opens a link
function open_link(param){
                view(param.link);
}
                