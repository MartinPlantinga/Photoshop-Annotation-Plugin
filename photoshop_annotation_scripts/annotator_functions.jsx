// FUNCTION SAVE LAYERS
function saveLayers (groupName, dir, fn, ext){
    var segmentation_list = [];
    if (groupName.layers.length == 0) {return}
    showByName(groupName.name);
    for (var m = groupName.layers.length - 1; m >= 0;m--) {
         var theLayer = groupName.layers[m];
         if (theLayer.typename == "ArtLayer") {
             hideAllLayers(doc);
             showByName(theLayer.name)
             //var file = new File(doc.path + '/' + dir + '/' + fn + '_' + ext + '_' + m + '.jpg')
             var fileName = dir  + fn + '_' + ext + '_' + m + '.png';
             segmentation_list.push(fileName);
             var file = new File(fileName);
             // var opts = new JPEGSaveOptions();
             var pngSaveOptions  = new PNGSaveOptions();
             pngSaveOptions.compression = 0;
             doc.saveAs(file, pngSaveOptions ,true);
             hideByName(theLayer.name);

         }
    }
    hideByName(groupName.name);
    return segmentation_list
};

// FUNCTION HIDE GROUPS AND LAYERS
function hideAll(doc){
    for (var m = doc.layers.length - 1; m >=0; m--){
        var theLayer = doc.layers[m];
        if (theLayer.typename == 'LayerSet'){
            hideByName(theLayer.name);
            hideAllLayers(theLayer);
        }
        else if (theLayer.typename == 'ArtLayer'){
            hideByName(theLayer.name);
        }
    }
};

// FUNCTION HIDE ALL LAYERS
function hideAllLayers (doc){
    for (var m = doc.layers.length - 1; m >=0; m--){
        var theLayer = doc.layers[m];
        if (theLayer.typename == 'ArtLayer'){
            hideByName(theLayer.name);
        }
    }
};

function hideAllGroupLayers (group){
    for (var m = group.length - 1; m >=0; m--){
        var theLayer = group.layers[m];
        if (theLayer.typename == 'ArtLayer'){
            hideByName(theLayer.name);
        }
    }
};

// FUNCTION SHOW ALL GROUPS
function showAllGroups (doc){
    for (var m = doc.layers.length -1; m >= 0; m--){
        var theLayer = doc.layers[m];
        if (theLayer.typename == 'LayerSet'){
            showByName(theLayer.name)
        }
    }
};

// FUNCTION HIDE ALL GROUPS
function hideAllGroups (doc){
    for (var m = doc.layers.length -1; m >= 0; m--){
        var theLayer = doc.layers[m];
        if (theLayer.typename == 'LayerSet'){
            hideByName(theLayer.name)
        }
    }
};

function hideByName(name) {
    var desc = new ActionDescriptor();
        var list = new ActionList();
            var ref = new ActionReference();
            ref.putName( charIDToTypeID('Lyr '), name );
        list.putReference( ref );
    desc.putList( charIDToTypeID('null'), list );
    executeAction( charIDToTypeID('Hd  '), desc, DialogModes.NO );
};

function getLayerIDByName(name) {
    try{
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "LyrI" ));
    ref.putName( charIDToTypeID( "Lyr " ), name );
    return executeActionGet(ref).getInteger(charIDToTypeID( "LyrI" ));
    }catch(e){}
};
function getLayerVisibilityByID( id ) {
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "Vsbl" ));
    ref.putIdentifier( charIDToTypeID( "Lyr " ), id );
    return executeActionGet(ref).getBoolean(charIDToTypeID( "Vsbl" ));
};

function showByName(name) {
    var desc = new ActionDescriptor();
        var list = new ActionList();
            var ref = new ActionReference();
            ref.putName( charIDToTypeID('Lyr '), name );
        list.putReference( ref );
    desc.putList( charIDToTypeID('null'), list );
    executeAction( charIDToTypeID('Shw '), desc, DialogModes.NO );
};

// GET THE LAYERS BY NAME
function collectLayers (theParent, allLayers) {
          if (!allLayers) {var allLayers = new Array}
          else {};
          for (var m = theParent.layers.length - 1; m >= 0;m--) {
                    var theLayer = theParent.layers[m];
// apply the function to layersets;
                    if (theLayer.typename == "ArtLayer") {
                        showByName(theLayer.name)
                        var file = new File(doc.path + '/' + 'test' + m + '.jpg')
                        var opts = new JPEGSaveOptions();
                        opts.quality = 4;
                        doc.saveAs(file, opts,true);
                        hideByName(theLayer.name)
                        allLayers.push(theLayer)
                              }
                    else {
                              allLayers = (collectLayers(theLayer, allLayers))
// this line includes the layer groups;
                              allLayers.push(theLayer);
                              }
                    };
          return allLayers
          };

function loadJson(absPath){
    var jsonFile = new File(absPath);
    jsonFile.open('r');
    var str = jsonFile.read();
    return JSON.parse(str);
}

function getObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// PICK RANDOM FILE
function randomFile(obj, numPictures){
    randomPicture = Math.random() * numPictures << 0;
    randomKey = 'p'+randomPictures;
    randomFile = obj[randomKey];
}

// CUT TO LAYER
function cutToLayer(){
    var idCtTL = charIDToTypeID( "CtTL" );
    executeAction( idCtTL, undefined, DialogModes.NO );
}

// MAKE CRISP SELECTION
function annotatorFunctionMakeSelectionCrisp(){
  // =======================================================
  var idsmartBrushWorkspace = stringIDToTypeID( "smartBrushWorkspace" );
      var desc1723 = new ActionDescriptor();
      var idsmartBrushRadius = stringIDToTypeID( "smartBrushRadius" );
      desc1723.putInteger( idsmartBrushRadius, 0 );
      var idsmartBrushSmooth = stringIDToTypeID( "smartBrushSmooth" );
      desc1723.putInteger( idsmartBrushSmooth, 0 );
      var idsmartBrushFeather = stringIDToTypeID( "smartBrushFeather" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc1723.putUnitDouble( idsmartBrushFeather, idPxl, 0.000000 );
      var idsmartBrushContrast = stringIDToTypeID( "smartBrushContrast" );
      var idPrc = charIDToTypeID( "#Prc" );
      desc1723.putUnitDouble( idsmartBrushContrast, idPrc, 100.000000 );
      var idsmartBrushShiftEdge = stringIDToTypeID( "smartBrushShiftEdge" );
      var idPrc = charIDToTypeID( "#Prc" );
      desc1723.putUnitDouble( idsmartBrushShiftEdge, idPrc, 0.000000 );
      var idsampleAllLayers = stringIDToTypeID( "sampleAllLayers" );
      desc1723.putBoolean( idsampleAllLayers, false );
      var idsmartBrushUseSmartRadius = stringIDToTypeID( "smartBrushUseSmartRadius" );
      desc1723.putBoolean( idsmartBrushUseSmartRadius, false );
      var idsmartBrushDecontaminate = stringIDToTypeID( "smartBrushDecontaminate" );
      desc1723.putBoolean( idsmartBrushDecontaminate, false );
      var idrefineEdgeOutput = stringIDToTypeID( "refineEdgeOutput" );
      var idrefineEdgeOutput = stringIDToTypeID( "refineEdgeOutput" );
      var idselectionOutputToSelection = stringIDToTypeID( "selectionOutputToSelection" );
      desc1723.putEnumerated( idrefineEdgeOutput, idrefineEdgeOutput, idselectionOutputToSelection );
  executeAction( idsmartBrushWorkspace, desc1723, DialogModes.NO );
}


// SELECT VISIBLE
function annotatorFunctionSelectVisible(){
  var idsetd = charIDToTypeID( "setd" );
      var desc55 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref27 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idfsel = charIDToTypeID( "fsel" );
          ref27.putProperty( idChnl, idfsel );
      desc55.putReference( idnull, ref27 );
      var idT = charIDToTypeID( "T   " );
          var ref28 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idChnl = charIDToTypeID( "Chnl" );
          var idTrsp = charIDToTypeID( "Trsp" );
          ref28.putEnumerated( idChnl, idChnl, idTrsp );
      desc55.putReference( idT, ref28 );
  executeAction( idsetd, desc55, DialogModes.NO );
}


// DESELECT
function annotatorFunctiondeselect(){
  var idsetd = charIDToTypeID( "setd" );
      var desc193 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref18 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idfsel = charIDToTypeID( "fsel" );
          ref18.putProperty( idChnl, idfsel );
      desc193.putReference( idnull, ref18 );
      var idT = charIDToTypeID( "T   " );
      var idOrdn = charIDToTypeID( "Ordn" );
      var idNone = charIDToTypeID( "None" );
      desc193.putEnumerated( idT, idOrdn, idNone );
  executeAction( idsetd, desc193, DialogModes.NO );
}

// FILL WITH FOREGROUND COLOR
function annotatorFunctionFillWithForegroundColor(){
  var idFl = charIDToTypeID( "Fl  " );
      var desc44557 = new ActionDescriptor();
      var idUsng = charIDToTypeID( "Usng" );
      var idFlCn = charIDToTypeID( "FlCn" );
      var idFrgC = charIDToTypeID( "FrgC" );
      desc44557.putEnumerated( idUsng, idFlCn, idFrgC );
      var idOpct = charIDToTypeID( "Opct" );
      var idPrc = charIDToTypeID( "#Prc" );
      desc44557.putUnitDouble( idOpct, idPrc, 100.000000 );
      var idMd = charIDToTypeID( "Md  " );
      var idBlnM = charIDToTypeID( "BlnM" );
      var idNrml = charIDToTypeID( "Nrml" );
      desc44557.putEnumerated( idMd, idBlnM, idNrml );
  executeAction( idFl, desc44557, DialogModes.NO );
}
