// LOAD FUNCTIONS
#include annotator_functions.jsx

// set foreground and background colors
backgroundColor.rgb.hexValue = 'ffffff';
foregroundColor.rgb.hexValue = '000000';

// INITIAL DEFINITIONS
var doc = app.activeDocument;

//LOAD BG LAYER
var backgroundLayer = doc.artLayers.getByName("Background");


// LOAD GROUPS
PUTLOADGROUPSHERE

// CUT SELECTION ON BG LAYER TO NEW LAYER
doc.activeLayer = backgroundLayer;

// remove feather from selection
annotatorFunctionMakeSelectionCrisp();

cutToLayer();

showByName(CURRENTGROUPNAME.name);

// SELECT VISIBLE
annotatorFunctionSelectVisible();


// FILL WITH FOREGROUND COLOR
annotatorFunctionFillWithForegroundColor()


// MOVE ACTIVE LAYER TO GROUP
aLayer = doc.activeLayer;
aLayer.move(CURRENTGROUPNAME, ElementPlacement.INSIDE)
hideByName(aLayer.name);
hideByName(CURRENTGROUPNAME.name);

// DESELECT
annotatorFunctiondeselect();


doc.activeLayer = backgroundLayer;
