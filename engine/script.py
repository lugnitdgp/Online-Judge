import argparse
import subprocess
import os
import filecmp
from judge.settings import ENGINE_PATH

def code_status(code,status):
    return {"code":code,"status":status}

def code_message(code,message):
    return {"code":code,"message":message}

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
    with open(path1) as f1, open(path2) as f2:
        if f1.read() == f2.read():
            return True
        else:
            return False

def run_program(command,compilation, time, mem, input_file, temp_output_file, output_file):
    os.system(compilation)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return code_message(1,temp_file.read())
    else:
        os.system(command)
        stat=status()
        res= None
        if stat['run_status'] == "OK":
            if (compare(output_file, temp_output_file)):
                stat['run_status'] = "AC"
                res = code_status(0,stat)
            else:
                stat['run_status'] = "WA"
                res =code_status(0,stat)
        else:
            res= code_status(2,stat)
        os.remove(temp_output_file)
        return res

def run_c(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "gcc -Wno-deprecated {} -o compiled_code 2> compile_log".format(f)     
    command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec compiled_code < {} > {}".format(
            ENGINE_PATH, time, mem, input_file, temp_output_file)
    return run_program(command,compilation,time, mem, input_file, temp_output_file, output_file) 

def run_cpp(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "g++ -o compiled_code {} 2> compile_log".format(f)     
    command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec compiled_code < {} > {}".format(
            ENGINE_PATH, time, mem, input_file, temp_output_file)
    return run_program(command,compilation,time, mem, input_file, temp_output_file, output_file) 

def run_java(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "javac {} 2> compile_log".format(f)     
    command = "sudo {} --cpu {} --mem {} --nproc 20 --usage usage.txt --exec /usr/bin/java -cp {} test < {} > {}".format(
            ENGINE_PATH, time, mem, os.path.dirname(ENGINE_PATH), input_file, temp_output_file)
    return run_program(command,compilation,time, mem, input_file, temp_output_file, output_file)

def run_python2(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "python2 -m py_compile {} 2> compile_log".format(f)     
    command = "sudo {} --cpu {} --mem {} --usage usage.txt --exec /usr/bin/python2 {} < {} > {}".format(
            ENGINE_PATH, time, mem, f, input_file, temp_output_file)
    return run_program(command,compilation,time, mem, input_file, temp_output_file, output_file) 

def run_python3(f, time, mem, input_file, temp_output_file, output_file):
    compilation = "python3 -m py_compile {} 2> compile_log".format(f)     
    command =  "sudo {} --cpu {} --mem {} --usage usage.txt --exec /usr/bin/python3 {} < {} > {}".format(
            ENGINE_PATH, time, mem, f, input_file, temp_output_file)
    return run_program(command,compilation,time, mem, input_file, temp_output_file, output_file) 
    
