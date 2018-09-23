  # Photoshop-Annotation-Plugin

  This plugin allows to do annotation of images with Photoshop.

  ## Dependencies
  The `setup_annotation_classes.py` script works with Python3.7 and requires the following packages:
  1. sys
  2. os
  3. numpy
  4. json
  5. tkinter
  6. re
  7. shutil

  ## Using Photoshop Annotation Plugin
  Run the setup script to setup the classes:
  ```bash
  python3 setup_annotation_classes.py
  ```

  The script will request the location where you want to put the created scripts. Photoshop monitors the `Presets/Scripts` directory to automatically retrieve scripts for their use within Photoshop, e.g.  `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts`. Select this path, or its equivalent for your operating system and / or Photoshop version.
