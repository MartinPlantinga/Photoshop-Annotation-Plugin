// LOAD FUNCTIONS
#include json2.js
#include annotator_functions.jsx

var json_data = 'C:/Users/nlmplan/Documents/Robotics/Data Annotation/Photoshop Scripts/Photoshop Scripts/images/json_files/images_dictionary.json';
var json_tmp = 'C:/Users/nlmplan/Documents/Robotics/Data Annotation/Photoshop Scripts/Photoshop Scripts/images/json_files/tmp.json';
var masks_path = 'C:/Users/nlmplan/Documents/Robotics/Data Annotation/Photoshop Scripts/Photoshop Scripts/images/segmentations/';

var jsonFile = loadJson(json_data);

// INITIAL DEFINITIONS
var doc = app.activeDocument;
var filename = app.activeDocument.name;
filename = filename.slice(0, -4)
var pathToSave = masks_path

//LOAD BG LAYER AND GROUPS
var backgroundLayer = doc.artLayers.getByName("Background");
var originalLayer = doc.artLayers.getByName("Original");
var tst_group = doc.layerSets.getByName('tst'); 
var tst2_group = doc.layerSets.getByName('tst2'); 

hideAll(doc)

// SAVE INDIVIDUAL LAYERS AS JPG FILES
var segmentation_paths_dict = {};
segmentation_paths_dict['tst'] = saveLayers(tst_group, pathToSave, filename, 'tst'); 
segmentation_paths_dict['tst2'] = saveLayers(tst2_group, pathToSave, filename, 'tst2'); 



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
