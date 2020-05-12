import argparse
import subprocess
import os
import filecmp


def status():
    make_temp_status = "sudo cat usage.txt > temp_file"
    os.system(make_temp_status)
    with open("temp_file", "r") as f:
        stat = f.read().split("\n")
        return {
            'elapsed_time': int(stat[1].split(":")[1].strip().split(" ")[0]),
            'memory_taken': int(stat[2].split(":")[1].strip().split(" ")[0]),
            'cpu_time': float(stat[3].split(":")[1].strip().split(" ")[0])
        }


def run_c(f, input_file, output_file):
    compilation = "gcc -o compiled_code " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo ./safeexec --usage usage.txt --exec compiled_code < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return {  # Passed
                "code": 0,
                "status": status()
            }
        else:
            return {  # Failed
                "code": 2,
                "status": status()
            }


def run_cpp(f, input_file, output_file):
    compilation = "g++ -o compiled_code " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo ./safeexec --usage usage.txt --exec compiled_code < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return {  # Passed
                "code": 0,
                "status": status()
            }
        else:
            return {  # Failed
                "code": 2,
                "status": status()
            }


def run_java(f, input_file, output_file):
    compilation = "javac " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo ./safeexec --cpu 1 --mem 1000000 --nproc 20 --exec /usr/bin/java test < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return {  # Passed
                "code": 0,
                "status": status()
            }
        else:
            return {  # Failed
                "code": 2,
                "status": status()
            }


def run_python2(f, input_file, output_file):
    compilation = "python2 -m py_compile " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo ./safeexec --usage usage.txt --exec /usr/bin/python2 " + f + " < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return {  # Passed
                "code": 0,
                "status": status()
            }
        else:
            return {  # Failed
                "code": 2,
                "status": status()
            }


def run_python3(f, input_file, output_file):
    compilation = "python3 -m py_compile " + f + " &> compile_log"
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo ./engine/safeexec --usage usage.txt --exec /usr/bin/python3 " + f + " < " + input_file + " > ./engine/output.txt"
        os.system(command)
        if (filecmp.cmp(output_file, "output.txt")):
            return {  # Passed
                "code": 0,
                "status": status()
            }
        else:
            return {  # Failed
                "code": 2,
                "status": status()
            }