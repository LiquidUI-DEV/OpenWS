﻿// Generated by Synactive Designer Version 2, 11, 208, 0
// Description:Edited by UMANG       

if(_transaction == 'MMBE') {
	if(<'G[%B087012_BLOCK_1000]'>.isValid)
		del("G[%B087012_BLOCK_1000]");
	if(<'G[%B088016_BLOCK_1000]'>.isValid)
		del("G[%B088016_BLOCK_1000]");
	if(<'G[%B334031_BLOCK_1000]'>.isValid)
		del("G[%B334031_BLOCK_1000]");
	if(<'P[/17]'>.isValid)
		del("P[/17]");
	set('F[MS_MATNR-LOW]','100-300');
	set('F[MS_LGORT-LOW]','');
	set('F[MS_WERKS-LOW]','1000');

	pushbutton([TOOLBAR],'@2M@Back','/n');	
	pushbutton([6,1],'@15@Execute','/8', {'size':[2,20]});
}	