// Sample_SD_Create_Page2.sjs

title("Create Sales Order Page 2");
pushbutton([0,0], "Back", "?", {"process":function(){RDpop();}});
pushbutton([1,0], "Next", "?", {"process":function(){RDpush({pack:"Create", prog:"Page3"})}});