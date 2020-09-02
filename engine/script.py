import argparse
import subprocess
import os
import filecmp
from judge.settings import ENGINE_PATH


def status():
    make_temp_status = "sudo cat usage.txt > temp_file"
    os.system(make_temp_status)
    with open("temp_file", "r") as f:
        stat = f.read().split("\n")
        return {
            'run_status': stat[0],
            'elapsed_time': int(stat[1].split(":")[1].strip().split(" ")[0]),
            'memory_taken': int(stat[2].split(":")[1].strip().split(" ")[0]),
            'cpu_time': float(stat[3].split(":")[1].strip().split(" ")[0])
        }


def compare(path1, path2):
    # Removes whitespace and tab characters from right side of each line
    # And creates a new file to hold the file data
    trim_cmnd = "sed --quiet 's/[ \\t]*$//;w"
    os.system(trim_cmnd+" file1.txt' "+path1)
    os.system(trim_cmnd+" file2.txt' "+path2)
    # Adds \n at eof
    os.system("echo '' >> file1.txt") 
    os.system("echo '' >> file2.txt")
    # Removes multiple \n at eof 
    rem_multi_nl = "sed -i -e :a -e '/^\\n*$/{$d;N;};/\\n$/ba' file"
    os.system(rem_multi_nl+"1.txt")
    os.system(rem_multi_nl+"2.txt")
    # Compares generated files
    compare_code = os.system("diff -q file1.txt file2.txt")
    # Removes the generated files 
    os.remove("file1.txt")
    os.remove("file2.txt")
    if compare_code == 0:
        return True
    else:
        return False


def run_c(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "gcc -Wno-deprecated {} -o compiled_code 2> compile_log".format(f)
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec compiled_code < {} > {}".format(
            ENGINE_PATH, time, mem, input_file, temp_output_file)
        os.system(command)
        stat = status()
        res = None
        if stat['run_status'] == "OK":
            if (compare(output_file, temp_output_file)):
                stat['run_status'] = "AC"
                res = {  # Passed
                    "code": 0,
                    "status": stat
                }
            else:
                stat['run_status'] = "WA"
                res = {  # Failed
                    "code": 0,
                    "status": stat
                }
        else:
            res = {"code": 2, "status": stat}
        os.remove(temp_output_file)
        return res


def run_cpp(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "g++ -o compiled_code {} 2> compile_log".format(f)
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec compiled_code < {} > {}".format(
            ENGINE_PATH, time, mem, input_file, temp_output_file)
        os.system(command)
        stat = status()
        res = None
        if stat['run_status'] == "OK":
            if (compare(output_file, temp_output_file)):
                stat['run_status'] = "AC"
                res = {  # Passed
                    "code": 0,
                    "status": stat
                }
            else:
                stat['run_status'] = "WA"
                res = {  # Failed
                    "code": 0,
                    "status": stat
                }
        else:
            res = {"code": 2, "status": stat}
        # os.remove(temp_output_file)
        return res


def run_java(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "javac {} 2> compile_log".format(f)
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo {} --cpu {} --mem {} --nproc 20 --usage usage.txt --exec /usr/bin/java -cp {} test < {} > {}".format(
            ENGINE_PATH, time, mem, os.path.dirname(ENGINE_PATH), input_file, temp_output_file)
        os.system(command)
        res = None
        stat = status()
        if stat['run_status'] == "OK":
            if (compare(output_file, temp_output_file)):
                stat['run_status'] = "AC"
                res = {  # Passed
                    "code": 0,
                    "status": stat
                }
            else:
                stat['run_status'] = "WA"
                res = {  # Failed
                    "code": 0,
                    "status": stat
                }
        else:
            res = {"code": 2, "status": stat}
        os.remove(temp_output_file)
        return res


def run_python2(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "python2 -m py_compile {} 2> compile_log".format(f)
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec /usr/bin/python2 {} < {} > {}".format(
            ENGINE_PATH, time, mem, f, input_file, temp_output_file)
        os.system(command)
        stat = status()
        res = None
        if stat['run_status'] == "OK":
            if (compare(output_file, temp_output_file)):
                stat['run_status'] = "AC"
                res = {  # Passed
                    "code": 0,
                    "status": stat
                }
            else:
                stat['run_status'] = "WA"
                res = {  # Failed
                    "code": 0,
                    "status": stat
                }
        else:
            res = {"code": 2, "status": stat}
        os.remove(temp_output_file)
        return res


def run_python3(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "python3 -m py_compile {} 2> compile_log".format(f)
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec /usr/bin/python3 {} < {} > {}".format(
            ENGINE_PATH, time, mem, f, input_file, temp_output_file)
        os.system(command)
        os.system(command)
        stat = status()
        res = None
        if stat['run_status'] == "OK":
            if (compare(output_file, temp_output_file)):
                stat['run_status'] = "AC"
                res = {  # Passed
                    "code": 0,
                    "status": stat
                }
            else:
                stat['run_status'] = "WA"
                res = {  # Failed
                    "code": 0,
                    "status": stat
                }
        else:
            res = {"code": 2, "status": stat}
        os.remove(temp_output_file)
        return res