﻿// Generated by Synactive Designer Version 2, 11, 210, 0
// Description:Edited by ACHIRAG   
/////////////////////////////////////////////////////////////////////////////////////
//LIST/TIME CONFIRMATION PAGE
/////////////////////////////////////////////////////////////////////////////////////

// If the flag is high, the display the script
if(z_flag == 1){

	del('M[/3]');
	del('M[/12]');
	del('M[/15]');
	
	// Clear the flag if the user types in a transaction
	onUIEvents["/n*"] = {"process":setFlag, "using":{"flag":0}};
	
	// Deleting pushbuttons
	del("P[Details]");
	del("P[Change <-> Display]");
	del("P[Update]");
	del("P[Select All]");
	del("P[Deselect All]");
	del("P[Sort in Ascending Order]");
	del("P[Sort in Descending Order]");
	del("P[Set Filter]");
	del("P[Graphic]");
	del("P[Spreadsheet]");
	del("P[Order]");
	del("P[Long Text]");
	del("P[Release Order]");
	del("P[Complete (Technically)]");
	del("P[Individual confirmation]");
	del("P[Expand Totals]");
	del("P[Totals Lines Only]");
	del("P[Current...]");

	// Set nav to false, letting the Left Column buttons know 
	// What to do if they are clicked
	nav = false;
	// To Display the Left Column
	leftCol(nav);

	//To Display the Top Row
	box([5,32], [9,130], "");
	
	//Breakdown or Corrective
	if(left_Col == 1 || left_Col == 3){
		pushbutton([6,38], "Create             ", "/niw21",  { "process":create, "size":[2,15]});
	}
	if(z_check == "list"){
		pushbutton([6,60], "@AF@List               ", "/niw37n", { "process":list_timeconf, "size":[2,15]});
		pushbutton([6,82], "Time Confirmation","/niw37n",{"process":list_timeconf, "size":[2,15],  "using":{"check":"timeconf"}});
	}
	else if (z_check == "timeconf"){
		pushbutton([6,60], "List               ","/niw37n", {"process":list_timeconf, "size":[2,15],  "using":{"check":"list"}});
		pushbutton([6,82], "@AF@Time Confirmation", "/niw37n", {"process":list_timeconf, "size":[2,20]});
		
		//All Parts Selected
		if(left_Col == 6){
			inputfield( [11,37], "Order Type", [11,52], { "size":13, "name":"z_ordertype"});
		}
	}

	image([0,0],"banner.jpg",{ "start":"http://www.guixt.com", "transparent":true});

	inputfield( [10,37], "Work Center", [10,52], { "size":13, "name":"z_workcenter"});
	pushbutton([10,90], "@01@Refresh         ",{"process":refresh, "size":[2,19]});

	// Depending on if we are under List or Time Confirmation
	// the Select will do something different
	if(z_check == "list"){
	pushbutton([10,112], "@01@Select          ", "/37", {"process":selectList, "size":[2,19]}); //CTRL+SHIFT+F1
	}
	else if(z_check == "timeconf"){
		pushbutton([10,112], "@01@Select          ", "/34", {"process":selectTimeConf, "size":[2,19]}); //CTRL+F10
	}


	pos("X[GRID1]", [12,32]);

	
}




//Function to Refresh the Work Center
function refresh(){
	
	// Go back a screen
	enter("/3");
	
	// On this screen update the information for the list
	onscreen 'RI_ORDER_OPERATION_LIST.1000'
		
		// If All Orders is selected
		if(left_Col == 6){
			// Specify which Order Type
			set("F[Order Type]", "&V[z_ordertype]");
		}
		
		// Go to Operations Tab
		enter('=S_TAB4');
	
	onscreen 'RI_ORDER_OPERATION_LIST.1000'
		// Specify which workcenter
		set('F[Operation WorkCenter]', '&V[z_workcenter]');
		
		//Execute List
		enter("/8");
	
	// If error message, capture
	onmessage
		if(_message.substring(0,2) == "E:"){
			message("E: " + _message);
			bugprint("GOT HERE");
			enter("/n");
			
			// Label which handles the screen changes if an error occurs
			goto ERR_FUNC_CONT;
		}
		// In case the message was jus a warning "W:"
		else{
			enter();
		}
		
	// If still on this screen then a Success messgae occured
	onscreen 'RI_ORDER_OPERATION_LIST.1000'	
		if(_message == "No objects were selected"){
			message("E:"+_message);
			enter("/n");
			// Label which handles the screen changes if an error occurs
			goto ERR_FUNC_CONT;
		}

		
	// onscreen "SAPLSLVC_FULLSCREEN.0500"
		// enter("?");
		// goto FUNC_END;

// This label takes the the screen back to the original list 
ERR_FUNC_CONT:;
	
	onscreen 'SAPLSMTR_NAVIGATION.0100'
	enter("/niw37n");
	
	bugprint("ENTERED IW37N")
	
	onscreen 'RI_ORDER_OPERATION_LIST.1000'
	//Breakdown
	if(left_Col == 1){
		set("F[Order Type]", "PM01");
	}
	//Preventive
	else if(left_Col == 2){
		set('F[Order Type]', 'PM03');
	}
	//Corrective
	else if(left_Col == 3){
		set('F[Order Type]', 'PM02');
	}
	//Capex
	else if(left_Col == 4){
		set('F[Order Type]', 'PM04');
	}
	//Any Orders
	else if(left_Col == 6){
		set('F[Order Type]', 'PM02')
		set('F[S_AUART-HIGH]', 'PM04');
	}


	if(!isBlank(z_default_funcloc)){
		set("F[Equipment]", "&V[z_default_funcloc]");
	}

	if(!isBlank(z_default_mainworkcenter)){
		set("F[Main work center]", "&V[z_default_mainworkcenter]");
	}
	
	set("F[Period]", "");
	enter('=S_TAB2');

	onscreen 'RI_ORDER_OPERATION_LIST.1000'
	
	if(!isBlank(z_default_planningplant)){
		set("F[Planning plant]", "&V[z_default_planningplant]");
	}
	
	
	if(z_check == "timeconf"){
		set('F[Status exclusive]', 'CNF');
	}
	enter('/8');

	FUNC_END:;
	
	// In case "/niw21" was entered, we need to set the flag back to high
	set("V[z_flag]", 1);
}
	///////////////////////////////////////////////