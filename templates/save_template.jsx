// LOAD FUNCTIONS
#include json2.js
#include annotator_functions.jsx

var json_data = SUBSJSONDATAPATH
var json_tmp = SUBSJSONTMPPATH
var masks_path = SUBSMASKPATH

var jsonFile = loadJson(json_data);

// INITIAL DEFINITIONS
var doc = app.activeDocument;
var filename = app.activeDocument.name;
filename = filename.slice(0, -4)
var pathToSave = masks_path

//LOAD BG LAYER AND GROUPS
PUTLOADBGLAYERANDGROUPANDSAVELAYERSSHERE


// Find file that is in state_in_process
var all_images_dict = loadJson(json_data);
for (var image_name in all_images_dict) {
    var image_dict = all_images_dict[image_name];
    if( image_dict['state_in_process'] == true &&
        image_dict['state_completed'] == false &&
        image_dict['state_skipped'] == false)
    {
      break;
    }
}

// Append the segmentations to the all_images_dict
for (class_key in segmentation_paths_dict){
  all_images_dict[image_name][class_key] = segmentation_paths_dict[class_key]
}
all_images_dict[image_name]['state_in_process'] = false;
all_images_dict[image_name]['state_completed'] = true;

var fileData = File(json_data);
fileData.open('w');
fileData.write(JSON.stringify(all_images_dict));
fileData.close()

// CLOSE FILE
doc.close(SaveOptions.DONOTSAVECHANGES);
