# setup_annotation_classes.py
#
# Description:
#   Setup the data annotation plugin for a custom set of annotation classes.
# Input:
#
# Output:
#


import sys
import os
import numpy as np
import json
try:
    import tkinter as tk  # Python2
    import tkFileDialog
    import tkMessageBox
except ImportError:
    from tkinter import *  # Python3# import import ipdb; ipdb.set_trace()
    import tkinter.filedialog as tkFileDialog
    import tkinter.messagebox as tkMessageBox

import re
from shutil import copyfile

import ctypes

# check if admin
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

# clear terminal
os.system('clear')
print(chr(27) + "[2J")

def ClearTerminal():
    # clear terminal
    os.system('clear')
    print(chr(27) + "[2J")


def ShowHeader():
    print("===========================================================")
    print("SETUP CLASS NAMES FOR THE ADOBE PHOTOSHOP ANNOTATION PLUGIN")
    print("===========================================================")
    print()

def CheckPlatform():
    if platform == 'linux2':
        print("You are on a Linux Computer.")
        print("Adobe Photoshop doesn't run on Linux.")
        print("Exiting setup.")
        sys.exit()

def PrintAllClasses(class_names):
    for i, class_name in enumerate(class_names):
        print(i, class_name)

def ClassNamesMenu():
    class_names = []
    exit_status = False
    number_of_classes = int(input("How many classes do you want to create (excluding background)?: \t"))
    while exit_status == False:

        class_names = ['background']

        for i in range(number_of_classes):
            string_prompt = "Please enter the name of class " + str(i+1) + " in small caps and in snake_case: \t"
            class_names.append(input(string_prompt))

        print()
        print("This is the list of classes you will have:")
        PrintAllClasses(class_names)
        print()

        exit_input = input("Is this correct? <y/n> \t")

        if exit_input == 'y':
            exit_status = True

        elif exit_input == 'n':
            change_entry = input("Do you want to change a specific entry name? Press 'n' if you want to start over again. <y/n>\t")
            if change_entry == 'n':
                main()
                continue
            elif change_entry == 'y':
                class_names = FixNames(class_names)
                exit_status = True

    return class_names

def FixNames(class_names):
    while True:
        entry_to_change = int(input("Which input do you want to change?: \t"))
        new_name = input("what is the new name of entry "+ str(entry_to_change) + " ?: \t")

        class_names[entry_to_change] = new_name

        continue_changes = input("Do you want to modify another entry? <y/n> \t")
        if continue_changes == 'y':
            continue
        elif continue_changes == 'n':
            print()
            print("This updated list of classes:")
            PrintAllClasses(class_names)
            check_if_correct = input("Is this correct? <y/n> \t")
            if check_if_correct == 'y':
                break
            elif check_if_correct == 'n':
                change_entry = input("Do you want to change a specific entry name? Press 'n' if you want to start over again. <y/n>\t")
                if change_entry == 'y':
                    class_names = FixNames(class_names)
                    break
                elif change_entry == 'n':
                    main()
    return class_names

def CreateGetFiles(class_names):

    get_files_text = CreateGetFilesText(class_names)

    with open('templates/script_template.jsx', 'r') as script_template:
        script_template_text = script_template.read()

    # update script_template_text with get_files_text
    script_template_text = re.sub('PUTLOADGROUPSHERE', get_files_text, script_template_text)

    for class_name in class_names:
        script_name = 'photoshop_annotation_scripts/get_{0}.jsx'.format(class_name)
        new_file = re.sub('CURRENTGROUPNAME', class_name+'_group', script_template_text)
        with open(script_name, 'w') as outfile:
            outfile.write(new_file)

def CreateStartFile(images_path, class_names):
    with open('templates/start_template.jsx', 'r') as start_template:
        start_template_text = start_template.read()

    # substitution data
    json_data = "'{0}/json_files/images_dictionary.json'".format(images_path)
    json_tmp = "'{0}/json_files/tmp.json'".format(images_path)
    create_start_text = CreateStartText(class_names)

    # update script_template_text with get_files_text
    start_template_text = re.sub('SUBSJSONDATAPATH', json_data, start_template_text)
    start_template_text = re.sub('SUBSJSONTMPPATH', json_tmp, start_template_text)
    start_template_text = re.sub('PUTCREATEGROUPSHERE', create_start_text, start_template_text)

    # write start file
    with open('photoshop_annotation_scripts/start.jsx', 'w') as outfile:
        outfile.write(start_template_text)

def CreateSaveFile(images_path, class_names):

    with open('templates/save_template.jsx', 'r') as save_template:
        save_template_text = save_template.read()

    # substitution data
    json_data = "'{0}/json_files/images_dictionary.json';".format(images_path)
    json_tmp = "'{0}/json_files/tmp.json';".format(images_path)
    masks_path = "'{0}/segmentations/';".format(images_path)
    create_save_text = CreateSaveText(class_names)

    # update script_template_text with get_files_text
    save_template_text = re.sub('SUBSJSONDATAPATH', json_data, save_template_text)
    save_template_text = re.sub('SUBSJSONTMPPATH', json_tmp, save_template_text)
    save_template_text = re.sub('SUBSMASKPATH', masks_path, save_template_text)
    save_template_text = re.sub('PUTLOADBGLAYERANDGROUPANDSAVELAYERSSHERE', create_save_text, save_template_text)

    # write start file
    with open('photoshop_annotation_scripts/save.jsx', 'w') as outfile:
        outfile.write(save_template_text)

def CreateGetFilesText(class_names):
    get_files_text = ''

    for class_name in class_names:
        if class_name != 'background':
            append_text = "var {0}_group = doc.layerSets.getByName('{0}');".format(class_name)
            get_files_text = get_files_text + append_text + ' \n'

    return get_files_text

def CreateStartText(class_names):
    create_start_text = ''

    for class_name in class_names:
        if class_name != 'background':
            append_text = "{0}_group = doc.layerSets.add();".format(class_name)
            create_start_text = create_start_text + append_text + ' \n'

    for class_name in class_names:
        if class_name != 'background':
            append_text = "{0}_group.name = '{0}';".format(class_name)
            create_start_text = create_start_text + append_text + ' \n'

    for class_name in class_names:
        if class_name != 'background':
            append_text = "hideByName('{0}');".format(class_name)
            create_start_text = create_start_text + append_text + ' \n'

    return create_start_text

def CreateSaveText(class_names):
    create_save_text = 'var backgroundLayer = doc.artLayers.getByName("Background");\nvar originalLayer = doc.artLayers.getByName("Original");\n'

    for class_name in class_names:
        if class_name != 'background':
            append_text = "var {0}_group = doc.layerSets.getByName('{0}');".format(class_name)
            create_save_text = create_save_text + append_text + ' \n'

    create_save_text = create_save_text + '\nhideAll(doc)\n\n'
    create_save_text = create_save_text + '// SAVE INDIVIDUAL LAYERS AS JPG FILES\n'
    create_save_text = create_save_text + 'var segmentation_paths_dict = {};\n'

    for class_name in class_names:
        if class_name != 'background':
            append_text = "segmentation_paths_dict['{0}'] = saveLayers({0}_group, pathToSave, filename, '{0}');".format(class_name)
            create_save_text = create_save_text + append_text + ' \n'

    return create_save_text

def PickDataDirectory(initialDirectory = '/'):
    root = tk.Tk()
    root.withdraw()
    directory = tkFileDialog.askdirectory(parent = root, initialdir = initialDirectory, title = 'Pick a directory')
    return directory

def MoveScriptsToPhotoshop(photoshop_path, annotation_scripts_path):
    dir_to_create = photoshop_path + '/annotator_scripts'
    if os.path.exists(dir_to_create):
        existing_scripts = [os.path.abspath(os.path.join(dir_to_create, file)) for file in os.listdir(dir_to_create)]
        for rm_file in existing_scripts:
            os.remove(rm_file)
    else:
        CreateDirectory(dir_to_create)

    scripts_to_move = [os.path.abspath(os.path.join(annotation_scripts_path, file)) for file in os.listdir(annotation_scripts_path) if ( file.endswith('jsx') or  file.endswith('js') )]

    for script_file in scripts_to_move:
        copyfile(script_file, os.path.join(dir_to_create,os.path.basename(script_file)))


def MakeJsonFile(images_path, class_names):

    dir_to_create = images_path + '/json_files'
    CreateDirectory(dir_to_create)

    json_filename = "images.json"
    images_list = [os.path.abspath(os.path.join(images_path, file)) for file in os.listdir(images_path) if ( file.endswith('jpg') or
                                                                                                            file.endswith('jpeg') or
                                                                                                            file.endswith('JPG') or
                                                                                                            file.endswith('png'))]

    pictures_lib  = {}
    for file_name in images_list:
        file_name_base = os.path.basename(file_name)
        pictures_lib[file_name_base]= {}
        pictures_lib[file_name_base]['full_path'] = file_name
        pictures_lib[file_name_base]['state_completed'] = False
        pictures_lib[file_name_base]['state_in_process'] = False
        pictures_lib[file_name_base]['state_skipped'] = False
        pictures_lib[file_name_base]['classes'] = class_names
        for class_name in class_names:
            pictures_lib[file_name_base][class_name] = []


    with open(images_path + '/json_files/images_dictionary.json', 'w') as outfile:
        json.dump(pictures_lib, outfile, sort_keys = True, ensure_ascii=False)

def CreateDirectory(dir_name):
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)


def CheckForExistingJson(dir_name):
    path_to_json = dir_name +'/json_files'
    if os.path.exists(path_to_json):
        existing_json = [os.path.abspath(os.path.join(path_to_json, file)) for file in os.listdir(path_to_json) if file.endswith('json')]
        # if there is a json file within the json_files directory
        if existing_json:
            warning_output = tkMessageBox.askyesno(title = "Warning", message = "The selected directory already contains a json file.\nDo you wish to overwrite it?")
            if warning_output:
                # remove json file
                for rm_file in existing_json:
                    os.remove(rm_file)
                # remove existing scripts
                existing_scripts = [os.path.abspath(os.path.join('photoshop_annotation_scripts', file)) for file in os.listdir('photoshop_annotation_scripts') if file.endswith('jsx')]
                for rm_file in existing_scripts:
                    os.remove(rm_file)
            else:
                tkMessageBox.showinfo(title = "Quiting", message = "Please rerun the setup with another path.")
                sys.exit()
    else:
        CreateDirectory(path_to_json)


def CheckForExistingSegmentations(dir_name):
    path_to_segmentations = dir_name +'/segmentations'
    if os.path.exists(path_to_segmentations):
        segmentations = [os.path.abspath(os.path.join(path_to_segmentations, file))for file in os.listdir(path_to_segmentations)]
        # if list is not empty
        if segmentations:
            warning_output = tkMessageBox.askyesno(title = "Warning", message = "The selected directory already contains segmentations.\nDo you wish to delete them?")
            if warning_output:
                files_to_remove = [os.path.abspath(os.path.join(path_to_segmentations, file)) for file in os.listdir(path_to_segmentations) if file.endswith('png')]
                for rm_file in files_to_remove:
                    os.remove(rm_file)
            else:
                tkMessageBox.showinfo(title = "Warning", message = "The Segmentations directory contains segmented images.\nMake sure to store them at another location before starting to annotate if you don't want to risk losing them.")
                sys.exit()
    else:
        CreateDirectory(path_to_segmentations)


def main():

    if is_admin():
        #
        ClearTerminal()
        ShowHeader()
        input("Press Enter to select the directory where the images are stored ... ")

        images_path = PickDataDirectory('.')
        CheckForExistingJson(images_path)
        CheckForExistingSegmentations(images_path)
        print("The selected directory is: {0}".format(images_path))

        ClearTerminal()
        ShowHeader()
        class_names = ClassNamesMenu()

        ClearTerminal()
        ShowHeader()
        print("Configuring Plugin for the following classes:")
        PrintAllClasses(class_names)
        CreateGetFiles(class_names)
        print()

        CreateStartFile(images_path, class_names)
        CreateSaveFile(images_path, class_names)

        MakeJsonFile(images_path, class_names)

        copyfile('./lib/annotator_functions.jsx', './photoshop_annotation_scripts/annotator_functions.jsx')
        copyfile('./lib/json2.js', './photoshop_annotation_scripts/json2.js')


        input("Press Enter to indicate where the Photoshop scripts should be copied to,\ne.g. C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts ... ")

        photoshop_path = PickDataDirectory('.')
        annotation_scripts_path = './photoshop_annotation_scripts'
        MoveScriptsToPhotoshop(photoshop_path, annotation_scripts_path)

    else:
        # Re-run the program with admin rights
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, __file__, None, 1)
if __name__ == '__main__':
    main()
