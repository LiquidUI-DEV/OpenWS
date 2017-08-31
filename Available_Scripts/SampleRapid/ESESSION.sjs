/*****************************************************************************************
*	Name of file:		Esession.sjs
*	Description	:		Declares any necessary functions and loads any necessary scripts.
*						Runs when the user first creates the session.
*****************************************************************************************/
load("RAPID.sjs");
load('functionsGeneric.sjs');
guixt_view = "on";
RDsetApp('Sample');
RDpush({app:'Sample', module:'SD', pack:'Create', prog:'Main'});
// variable for the application
vApp = RDgetApp();