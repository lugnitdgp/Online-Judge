import argparse
import subprocess
import os
import filecmp

def run_c(f, input_file, output_file):
    compilation = "gcc -o compiled_code " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        return "Compilation Error"
    else:
        command = "sudo ./safeexec --usage usage.txt --exec compiled_code < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return "Testcase passed"
        else:
            return "Testcase failed"

def run_cpp(f, input_file, output_file):
    compilation = "g++ -o compiled_code " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        return "Compilation Error"
    else:
        command = "sudo ./safeexec --usage usage.txt --exec compiled_code < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return "Testcase passed"
        else:
            return "Testcase failed"

def run_java(f, input_file, output_file):
    compilation = "javac " + f + " &> compile_log"
    os.system(compilation)
    if(os.stat("compile_log").st_size != 0):
        return "Compilation Error"
    else:
        command = "sudo ./safeexec --cpu 1 --mem 1000000 --nproc 20 --exec /usr/bin/java test < " + input_file + " > output_of_" + input_file.split(".")[0] + ".txt"
        os.system(command)
        if(filecmp.cmp(output_file, "output_of_" + input_file.split(".")[0] + ".txt")):
            return "Testcase passed"
        else:
            return "Testcase failed"


def run_python2(f, input_file, output_file):
    compilation = "python -m py_compile " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        return "Compilation Error"
    else:
        command = "sudo ./safeexec --usage usage.txt --exec python2 " + f + " < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return "Testcase passed"
        else:
            return "Testcase failed"


def run_python3(f, input_file, output_file):
    compilation = "python -m py_compile " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        temp_file = open("compile_log","r+") 
        return { # Compilation Error
            "code": 1,
            "message": temp_file.read()
        }
        temp_file.close()
    else:
        command = "sudo ./safeexec --usage usage.txt --exec python3 " + f + " < " + input_file + " > temp/output_of_main" + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "temp/output_of_main" + ".txt")):
            return { # Passed
                "code": 0,
                "message": "Testcase passed"
            }
        else:
            temp_file = open("temp/output_of_main.txt","r+") 
            return { # Failed
                "code": 2,
                "message": "Testcase failed \n Your output: {}".format(temp_file.read())
            }
            temp_file.close()