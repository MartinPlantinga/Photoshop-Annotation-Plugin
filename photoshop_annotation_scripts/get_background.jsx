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
var tst_group = doc.layerSets.getByName('tst'); 
var tst2_group = doc.layerSets.getByName('tst2'); 


// CUT SELECTION ON BG LAYER TO NEW LAYER
doc.activeLayer = backgroundLayer;

// remove feather from selection
annotatorFunctionMakeSelectionCrisp();

cutToLayer();

showByName(background_group.name);

// SELECT VISIBLE
annotatorFunctionSelectVisible();


// FILL WITH FOREGROUND COLOR
annotatorFunctionFillWithForegroundColor()


// MOVE ACTIVE LAYER TO GROUP
aLayer = doc.activeLayer;
aLayer.move(background_group, ElementPlacement.INSIDE)
hideByName(aLayer.name);
hideByName(background_group.name);

// DESELECT
annotatorFunctiondeselect();


doc.activeLayer = backgroundLayer;
