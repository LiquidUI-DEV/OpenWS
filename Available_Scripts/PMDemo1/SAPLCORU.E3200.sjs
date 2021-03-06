﻿// Generated by Synactive Designer Version 2, 11, 210, 0
// Description:Edited by ACHIRAG
// ///////////////////////////////////////////////////////////////////////////////////
// CHANGE TIME CONFIRMATION
// ///////////////////////////////////////////////////////////////////////////////////


// If the flag is high, the display the script
if(z_flag == 1){

	del('M[/3]');
	del('M[/12]');
	del('M[/15]');

	
	// Clear the flag if the user types in a transaction
	onUIEvents["/n*"] = {"process":setFlag, "using":{"flag":0}};

	// Delete Pushbuttons
	del("P[First operation]");
	del("P[Previous operation]");
	del("P[Next operation]");
	del("P[Last operation]");
	del("P[Exit + next]");
	del("P[Goods movements overview]");
	del("P[Notification]");
	del("P[Object list]");
	del("P[MeasDocuments]");
	del("P[Display object]");
	del("P[Text]");
	del("F[Posting date]");
	del("F[Acctg Indicator]");
	del("F[Personnel no.]",{ "triple":true});
	del("F[Reason]",{ "triple":true});
	del("F[AFRUD-WERKS]");
	del("F[AFRUD-OFMNU]");
	del("F[AFRUD-IDAUE]");
	del("F[AFRUD-PEDZ]");
	del("F[System Status]");
	del("F[Activity Type]");
	del("F[Confirmation]");
	del("F[Forecast End]");
	del("F[Confirm. text]");
	del("F[Remaining Work]");
	del("F[Actual Duration]");
	del("F[Wage Type]");
	del("F[Order.text]",{ "text":true});
	del("F[Oper./Act..text]",{ "text":true});
	if(<"F[AFRUD-SATZA]">.isValid){
		del("F[AFRUD-SATZA]");
	}
	del("C[Long text exists]");
	del("G[Confirmation Data]",{ "box":true});
	del("G[Total Confirmation Data]");

	// Set nav to false, letting the Left Column buttons know 
	// What to do if they are clicked	
	nav = false;
	// To display the Left Column
	leftCol(nav);

	// To display the Top Row
	box([5,32], [9,130], "");
	// Breakdown or Corrective
	if(left_Col == 1 || left_Col == 3){
		pushbutton([6,38], "Create               ", "/niw21",{ "process":create, "size":[2,20]});
	}
	pushbutton([6,60], "List                 ", "/niw37n",{ "process":list_timeconf, "size":[2,20], "using":{"check":"list"}});
	pushbutton([6,82], "Time Confirmation    ", "/niw37n",{ "process":list_timeconf, "size":[2,20], "using":{"check":"timeconf"}});
	pushbutton([6,104], "@AF@Change Confirmation",{ "process":create, "size":[2,21]});

	// Middle Body box
	box([10,32], [27,130], "");

	inputfield( [11,33], "Area", [11,48],{ "name":"z_timeconf_area1", "size":16, "readonly":true});
	if(!isBlank(z_timeconf_area2)){
		text([11,69], "&V[z_timeconf_area2]",{ "size":20});
	}

	inputfield( [12,33], "Equipment", [12,48],{ "name":"z_timeconf_equip1", "size":16, "readonly":true});
	if(!isBlank(z_timeconf_equip2)){
		text([12,69], "&V[z_timeconf_equip2]",{ "size":21});
	}
	inputfield( [13,33], "Description", [13,48],{ "name":"z_timeconf_desc", "size":28, "readonly":true});

	pos("F[Oper./Act.]", [11,98]);
	pos("F[Order]", [12,98]);

	box([15,33], [21,128], "Time Confirmations/Activities");
	pos("F[Work Center]", [16,34]);
	pos("F[RCR01-KTEXT]", [16,62],{ "text":true});
	pos("F[AFRUD-ISDD]", [17,34]);
	pos("F[AFRUD-ISDZ]", [17,61]);

	pos("F[AFRUD-IEDD]", [17,82]);
	pos("F[AFRUD-IEDZ]", [17,109]);
	pos("F[Actual Work]", [18,34]);
	pos("F[AFRUD-ISMNU]", [18,61]);

	pos("C[Final Confirmtn]", [20,34]);
	text("C[Final Confirmtn]", "Final Confirmation");

	pos("C[Clear Open Res.]", [20,58]);
	text("C[Clear Open Res.]", "Clear Open Reservations");

	pos("C[No Remain. Work]", [20,88]);
	text("C[No Remain. Work]", "No Work Remaining");

	pushbutton([19,110], "@01@Save          ", "/11",{ "size":[2,17]});

	image([0,0],  "banner.jpg",{ "start":"http://www.guixt.com", "transparent":true});
}