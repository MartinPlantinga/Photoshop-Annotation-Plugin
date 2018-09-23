# Photoshop-Annotation-Plugin

This plugin allows to do annotation of images with Photoshop.

## Requirements
The `setup_annotation_classes.py` script works with Python3.7 and both Windows as MacOS. For its proper working it requires the following Python 3 packages:
1. sys
2. os
3. numpy
4. json
5. tkinter
6. re
7. shutil
These can be installed with `pip3`.

## Setup
Run the setup script to define the classes, create a Json file with information about the images and create the JavaScript scripts for Photoshop:
```bash
python3 setup_annotation_classes.py
```
The script will create two directories within the directory where the images are stored:
1. `json_files`
2. `segmentations`
The prior contains a JSON file with information about the segmentations of the images and will be used to track changes. The latter will contain all the segmented B&W masks of the images.

The script will request the location where you want to put the created scripts. Photoshop monitors the `Presets/Scripts` directory to automatically retrieve scripts for their use within Photoshop, e.g.  `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts`. Select this path or its equivalent for your operating system and / or Photoshop version.

Once the script has finished, you can find the created scripts within Photoshop under `File > Scripts`. There, you will find (amongst others) the following scripts:
1. start
2. save
3. get_<class_name_1>
4. get_<class_name_2>
   ...
where the `<class_name_n>` in `get_<class_name_n>` refers to each of the classes you set up when invoking the `setup_annotation_classes.py` script.

### Setting up the keyboard shortcuts
The plugin works most efficiently when setting up keyboard shortcuts for each of the above mentioned scripts. In order to assign a keyboard shortcut to a script, go to `Edit > Keyboard Shortcuts`, select one of the scripts under `File > Scripts` and create a shortcut. For ease of use, it is recommended to use a one-letter shortcut.

## Using the Photoshop Annotation Plugin
Once the plugin has been set up, as described above, you can start to use the plugin.

The following table describes how to use each of the scripts.

|Action | Description |
|---|---|
|Loading a new image| Run the `start` script to load an image from the directory of images you selected in the Setup step. This will load an image that has not been loaded before (according to the JSON file created in the Setup step).|
|Discarding an image | Run the `start` script again if you want to discard an image from being annotated. Note that the image has to be open within Photoshop to be able to discard the image. This will assign the status `skipped` to the entry of the image in the JSON file that was created in the Setup step. |
|Segmenting a part of the image | Select the part that you want to assign to one of the classes with one of the selection tools (e.g. Marqee tool, Lasso tool, or Quick Selection tool). Once you have selected all the pixels you want to assign to (an instance of) a class, invoke the script that corresponds to the desired class, e.g. `get_class_1`. You can then continue to another segmentation, saving all segmentations or discarding the image. To undo changes, use the `History` window (`Window > History`). The `get_<class_name>` script cuts out the selected part and makes a mask out of it that is placed under the layer group that correspond to the class, e.g. layer group `class_1`.|
|Saving the segmentation(s)| Once you have finished with segmenting an image, you can save the segmentations by invoking the `save` script. This will create a mask of each of the segmentations and store them in the `segmentations` directory. Additionally, the JSON file will be updated by assigning the status `completed` to the image's entry and creating a list of the segmentation masks that were stored in the `segmentations` directory. |
|Stopping the annotation process | You can quit Photoshop to stop annotating. Note that if you haven't saved the annotations, next time you start annotating, you will continue with the same image, but without the annotations of the image.

### Tips
1. Make use of the `Alt` key to remove regions of an existing selection
2. Make use of the `Shift` key to add regions to an existing selection.
3. Make use of the `History` window (`Window > History`) to undo changes.
