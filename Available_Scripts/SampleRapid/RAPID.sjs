// RAPID Application Infrastructure
// Copyright (c) 2013, Synactive Inc
// Application, Module, Package, Program

var g_globalthis = this;	// so that we can access the global when we are inside of a function

Object.extend = function(subClass, baseClass) {
    function inheritance() { }
    inheritance.prototype = baseClass.prototype;
    subClass.prototype = new inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
}

Object.clone = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = Object.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Object.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
}

RAPIDApplication = function(szApp) {
    this.szApp   = szApp;
    this.modules = [];
    this.stack   = [];			// desProgram Navigation stack
    this.defaultRenderers = [];		// registered any in the form of  _program._language+_dynpro. Content must be in desProgram
}

RAPIDApplication.prototype.lookupModule = function(szModule, bCreate)
{
    if(this.modules[szModule] == void 0) {
        if(bCreate)
	    this.modules[szModule] = new RAPIDModule(szModule);
	else {
	    println('[lookupModule] Module '+szModule+' not found and not instanciated');
		}
        }
    var objModule = this.modules[szModule];
    return objModule;
}

RAPIDApplication.prototype.isTest = function()
{
    return _database=='TRX';	// if Juneau, turn everything on
}

// pushes the current app into the stack, and replace current with our target
RAPIDApplication.prototype.push = function(desPackage) {
    if(this.stack.length > 0) {
        var vtop = Object.clone(this.top());
		for (var prop in desPackage ) vtop[prop] = desPackage[prop];	// copy over what is specified
			desPackage = vtop;	// overwrite it
		}
        
    desPackage.tcodeback = '/n'+_transaction;	// store the 'current' tcode on top of the stack so that we can be used to return
    this.stack.push( desPackage );
    
    // check for limits here
    if(this.stack.length > 20) {
		// a navigation stack of more than 20, something MUST be wrong
		this.stack.remove(0,10);
		println('SCRIPT ERROR!!!!!!!!!!!!!!! Navigation stack cut by 10');
	}
}

RAPIDApplication.prototype.pop = function(objPackage) {
    return  this.stack.pop();
}

// returns the stack top object
RAPIDApplication.prototype.top = function() {
    var desPack = this.stack[this.stack.length-1];
    if(desPack != void 0 && desPack.app == void 0) {
       desPack.app = this.szApp;	// desPack does not always have to specify app, if not there, then put it there
       }
    return desPack;
}

// if top contains {app:'PM',module:'fos',prog:'findorder'} and desPackage contains {prog:'launchPanel'}
// after this call, stack will be cleared, and top will contain {app:'PM',module:'fos',prog:'launchPanel'}
RAPIDApplication.prototype.renew = function(desPackage) {
    var vtop = this.top();	// keeps a copy
    this.stack = [];		// clear out the stack
    // copy overwrites
    for (var prop in desPackage ) vtop[prop] = desPackage[prop];
    this.stack.push(vtop);	// now resets it
}

// if desPackage is {prog:'launchPanel'}, we'll pop the stack until we find an entry of
// {prog:'launchPanel'}
RAPIDApplication.prototype.poptill = function(desPackage) {
   var vProp;
   var vEntry;
   for(var prop in desPackage) {
       // we'll hack to find one
       vProp = prop;
       vEntry= desPackage[prop];
   }
   // now we pop till we find it
   do {
        if(this.top()[vProp] == vEntry)		// found the top to have that
           break;				// entry, break
	else
	    this.pop();				// else continue to pop
   } while(this.stack.length>0);
}

RAPIDApplication.prototype.clearStack = function()
{
    println('[clearStack] stack cleared');
    this.stack = [];
}

// Adds Main Menu, hooks back, and hook escape
RAPIDApplication.prototype.addMainMenu = function() {
    pushbutton([TOOLBAR],"@PQ@Main Menu", RDgetApp().tcodemainmenu, {process:function(){RDpoptill({prog:'launchPanel'})}});
    onUIEvents['/3']={fcode:RDtop().tcodeback,process:function() {RDpop();}};	// we use tcodeback, so this because a callable
    onUIEvents['/12']={fcode:RDtop().tcodeback,process:function(){RDpop();}};	// module that knows how to return to anywhere
}

// an application gets to handle a process proc lookup
RAPIDApplication.prototype.proc  = function(desProgram) {
    // the applicaiton will transafer the responsiblity to module, so that module
    // can customize
    var vModule = this.lookupModule(desProgram.module, true);
    return vModule.proc(desProgram);
}

// returns the standardized proc_PM_utilities_lc_findleakobjects
RAPIDApplication.prototype.procname  = function(desProgram) {
    var fnVar = 'proc_'+ desProgram.app + '_' + desProgram.module + '_' + desProgram.pack + '_' + desProgram.prog;
    return fnVar;
}

// this looks up any apps registered default renders and invoke the render
RAPIDApplication.prototype.defaultRender = function() {
    // each app should only defaultRender once, and never recurse
	if(!this.m_inDefaultRendering) {
	    this.m_inDefaultRendering = true;
        var szFname = _program + '.' + _language + _dynpro;
        println('[defaultRender] ' + szFname);
        RAPIDPackageManager.render(this.defaultRenderers[szFname], {defaultrender:true});
		delete this.m_inDefaultRendering;
		}
	else {
	    println('Already in app.defaultRender');
	}
}

RAPIDModule = function(szModule) {
    println('[RAPIDModule constructor] '+szModule);
    this.szModule = szModule;
}

// a module gets to process a process proc lookup, the default will do nothing
RAPIDModule.prototype.proc = function(desProgram)
{
    return void 0;
}

RAPIDPackageManager = {apps:[]};
RAPIDPackageManager.bAlwaysLoad = true;	// during debugging, turn this on, so that Package is always loaded
RAPIDPackageManager.load   = function(objPackage, miscObj)
{
    var szApp = objPackage.app;
    var szModule = objPackage.module;
    var szPackage= objPackage.pack;
    var szProgram= objPackage.prog;
    // generates a name like
    // pac_APPP_Package.
    
    if(this.bAlwaysLoad) {
	var fnName = 'rapid_'+ szApp + '_' + szModule + '_' + szPackage + '_' + szProgram + '.sjs';
	println('Load '+fnName);
	load(fnName);	// unfortunately, load does not return any meaningful status of the file execution
    }
}

RAPIDPackageManager.render = function(desPackage, szOption)
{
    if(guixt_view!='on') return;
    if(desPackage != void 0) {
	this.load(desPackage, szOption);
        }
    else
        RDdefaultRender();
}

RAPIDPackageManager.defaultRender = function() {
    return this.getApp().defaultRender();
}

// returns the global process function (called a proc) that we have defined in a specific naming
// convention
RAPIDPackageManager.proc = function(desProgram)
{
    var vApp = RDgetApp();
    if(vApp.stack.length > 0) {		// pick up top of stack defaults if any
        var vtop = Object.clone(vApp.top());
	    for (var prop in desProgram ) vtop[prop] = desProgram[prop];	// copy over what is specified
	    desProgram = vtop;	// overwrite it
        }

    // see if app handles it
    var ret = RDgetApp(desProgram.app).proc(desProgram);
    if(ret == void 0) {
        // will do lookup myself
	var fnVar = RDgetApp().procname(desProgram);
	ret = g_globalthis[fnVar];
	if(ret == void 0) println('[proc] function '+fnVar+ ' NOT FOUND!!!');
	//println(g_globalthis['RAPIDModule']);
	//println(eval('proc_PM_utilities_lc_findleakobjects'));	
	}
    return ret;
}

// creates the App object if not found
RAPIDPackageManager.getApp = function(szApp) {
    if(szApp == void 0) szApp = this.m_cApp;	// if called without a parameter, we'll return the 'current' app
    if(this.apps[szApp] == void 0)
	this.apps[szApp] = new RAPIDApplication(szApp);	// create the app objcect
    return this.apps[szApp];    
}

// this sets the default app
RAPIDPackageManager.setApp = function(szApp) {
   var vApp = this.getApp(szApp);	// create the App object if neccessary
   vApp.clearStack();			// when we set the app, reset the stack to zero
   this.m_cApp = szApp;	// current App
}

// create a global shortcut to retrieve the app object
RDgetApp = function(szApp) {
    // make sure the 'this' is RAPIDPackageManager, which is a global object
    return RAPIDPackageManager.getApp.call(RAPIDPackageManager, szApp);
}

RDsetApp = function(szApp) {
    return RAPIDPackageManager.setApp.call(RAPIDPackageManager, szApp);
}

// pushes the package descriptor on the stack. Package descriptor looks like {module:'xx',prog;'yy'}
RDpush = function(desPackage) {
    var vApp = RAPIDPackageManager.getApp();
    return vApp.push(desPackage);
}

// after poping, we typically DON'T CARE what we poped. Simply because we care only about the top of stack
RDpop = function() {
    var vApp = RAPIDPackageManager.getApp();
    return vApp.pop();
}

// renew replace the whole stack with what is specified. RDrenew can be used to reset the stack if
// we don't know where we are
RDrenew = function(desPackage) {
    var vApp = RAPIDPackageManager.getApp();
    return vApp.renew(desPackage);
}

// RDpoptill is used like
// pushbutton([TOOLBAR],"@PQ@Main Menu", RDgetApp().tcodemainmenu, {process:function(){RDpoptill({prog:'launchPanel'})}});
// where we'll pop the stack until we reach the 'launchPanel' of this module
RDpoptill = function(desPackage) {
    var vApp = RAPIDPackageManager.getApp();
    return vApp.poptill(desPackage);
}

RDtop = function() {
    var vApp = RAPIDPackageManager.getApp();
    return vApp.top();
}

// This is the only line that needs to be in the traditional dynpro screen
RDrender = function() {
    RAPIDPackageManager.render(RDtop(), {});
}

// this is HOW you specify the process
//	pushbutton([TOOLBAR],"@15\\QExecute@Find Leak Object","/nih08",{process:RDproc()});
// In this case we will lookup a proc_PM_utilities_lc_findleakobjects, just because that is at the top of the stack
// At this point, you can any Program Descriptor
function RDproc(desProgram) {
    if(desProgram == void 0) desProgram = RDtop();
    return RAPIDPackageManager.proc(desProgram);
}

// this function gets called in two instances
// 1: an RDassert failed
// 2: there was nothing on the stack to render
function RDdefaultRender()
{
    RAPIDPackageManager.defaultRender();
}

/* call to verify that we are ineed in the right dynpro and program
 * dynpro, program, transaction */
function RDassert(objVerify) 
{
    for(var v in objVerify) {
        switch(v) {
	    case 'dynpro':
	        if(objVerify[v]!=_dynpro) { RDdefaultRender(); throw "Wrong dynpro"; }
		break;
	    case 'program':
	        if(objVerify[v]!=_program) { RDdefaultRender(); throw "Wrong program"; }
		break;
	    }
    }
}

RAPIDPackage = function(szApp, szModule, szPackage, miscObj)
{
    println('[RAPIDPackage constructor] '+szApp+' '+szModule+' '+system.stringify(miscObj));
    this.m_szApp     = szApp;
    this.m_szModule  = szModule;
    this.m_szPackage = szPackage;
    this.m_miscObj   = miscObj;	// contains tcode, and tabstrip
    RAPIDPackageManager.manage(this);
}

RAPIDPackage.prototype.render = function() {}


// RAPID is an infrastructure to bifurcate screen scripts with functionality.
// RAPID groups script not with screen, but with Application, Module and
// Package organization

// Step #1: To use rapid. Hook on to a screen script, like RIQMEL20.E1000.sjs
// and put a single line like this:

// RAPIDPackageManager.render({app:'PM', module:'COMMON',pack:'lc', prog:'objectsearch'}, {type:vtype});

// This will cause RAPID will load up pac_COMMON_objectsearch.sjs
// and invoke the RAPIDPackage::render in the derived RAPIDPackage object.

//
// In pac_COMMON_objectsearch.sjs
// Step #2: declare a derived object
// #1 declare the derived object
// riqmel201000default = function(szApp, szModule, szPackage, miscObj) {
//    riqmel201000default.baseConstructor.call(this, szApp, szModule, szPackage, {_transaction:'IW29'});
// }

// Step #3 call extend to extend prototypes
// Object.extend(riqmel201000default, RAPIDPackage);

// Step #4 declare the render method
// riqmel201000default.prototype.render = function() {
//    riqmel201000default.superClass.render.call(this);
// additional render statement here
// }
