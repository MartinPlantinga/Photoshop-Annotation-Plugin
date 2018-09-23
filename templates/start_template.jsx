// LOAD JSON
#include json2.js;
#include annotator_functions.jsx


var json_data = SUBSJSONDATAPATH
var json_tmp = SUBSJSONTMPPATH

// CHECK IF FILE IS OPEN
try {
    // If file is open:
    // 1. Set state_skipped to true
    // 2. Continue to the next images
    // Only works if a document is open:
    var doc = app.activeDocument;

    // LOOK FOR IMAGE WITH state_in_process STATE ENABLED
    var all_images_dict = loadJson(json_data);

    for (var image_name  in all_images_dict) {
        if( all_images_dict[image_name]['state_skipped'] == false &&
            all_images_dict[image_name]['state_completed'] == false &&
            all_images_dict[image_name]['state_in_process'] == true)
        {
          break;
        }
    }

    alert("Discarding Image");

    all_images_dict[image_name]['state_skipped'] = true;
    all_images_dict[image_name]['state_in_process'] = false;

    // 1. Make the data_tmp.json file the data.json file
    var fileData = File(json_data);
    fileData.open('w');
    fileData.write(JSON.stringify(all_images_dict));
    fileData.close();

    doc.close(SaveOptions.DONOTSAVECHANGES);

}
catch(e) {

}

finally{
  // LOAD JSON FILE
  var all_images_dict = loadJson(json_data);
  var numPictures = getObjectSize(all_images_dict);

  // GET KEY AND VALUE PAIR OF JSON OBJECT
  for (var image_name in all_images_dict) {
      if( all_images_dict[image_name]['state_skipped'] == false &&
          all_images_dict[image_name]['state_completed'] == false)
      {
        break;
      }
  }

  // OPEN DOCUMENT
  if (all_images_dict[image_name]['state_skipped'] == false)
  {
    var docToOpen = File(all_images_dict[image_name]['full_path']);
  open(docToOpen);
  }

  // UPDATE THE STATUS OF THE ENTRY TO `state_in_process` IN THE JSON FILE
  all_images_dict[image_name]['state_in_process'] = true;
  var file = File(json_data);
  file.open('w')
  file.write(JSON.stringify(all_images_dict))
  file.close()


  // INITIAL DEFINITIONS
  var doc = app.activeDocument;


  // UNLOCK BACKGROUND LAYER
  try{
    var backgroundLayer = doc.artLayers.getByName("Background");
  }
  catch(e){
    var backgroundLayer = doc.artLayers.getByName("Layer 1");
  }
  backgroundLayer.isBackgroundLayer= false;
  backgroundLayer.name = 'Background';
  backgroundLayer.copy();
  var imageCopy = doc.artLayers.add();
  imageCopy.name = 'Original';
  doc.paste();
  hideByName('Original');

  doc.activeLayer = backgroundLayer;

  // CREATE GROUPS
  PUTCREATEGROUPSHERE

  // GO BACK TO BACKGROUND LAYER
  doc.activeLayer = backgroundLayer;
}
