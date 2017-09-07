del("X[IMAGE_CONTAINER]");
del('P[/35]'); //SAP menu
del('P[/36]'); //SAP Business Workplace
del('P[/42]'); //Add to Favorites
del('P[@0Z@]');
del('P[@0H@]');
del('P[@0I@]');
del('P[@6C@]');
del('P[@ES@]');
if(<'P[/17]'>.isValid) //Other menu
	del('P[/17]');
if(<'P[/48]'>.isValid) //Create role
	del('P[/48]');
if(<'P[@ID@]'>.isValid) //Assign users
	del('P[@ID@]'); 
if(<'P[@0P@]'>.isValid) //Documentation
	del('P[@0P@]');

RDrender();
