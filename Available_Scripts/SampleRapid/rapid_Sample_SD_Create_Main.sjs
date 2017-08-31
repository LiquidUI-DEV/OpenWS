// Sample_SD_Create_Main.sjs

title("Create Sales Order");
pushbutton([0,1], "Next", "?", {"process":function(){RDpush({pack:"Create", prog:"Page2"})}});