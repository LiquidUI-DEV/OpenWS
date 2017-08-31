// SAPLSMTR_NAVIGATION.E0100.sjs
del('X[IMAGE_CONTAINER]');
del('P[/14]');		// Delete Favorites
del('P[/17]');		// Other menu
del('P[/18]');		// Other menu
del('P[/34]');		// User menu
del('P[/35]');		// SAP menu
del('P[/36]');		// SAP Business Workplace
del('P[/37]');		// Move Favorites up
del('P[/38]');		// Move Favorites down
del('P[/39]');		// Change Favorites
del('P[/42]');		// Add to Favorites
del('P[/45]');		// Assign users
del('P[/47]');		// Documentation
del('P[/48]');		// Create role
RDrender();