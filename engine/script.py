import argparse
import subprocess
import os
import filecmp
from judge.settings import ENGINE_PATH, OUTPATH_DIR
from interface.models import Programming_Language


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
    # Compares generated files
    compare_code = os.system("diff -q "+path1+" "+path2)
    if compare_code == 0:
        return True
    else:
        return False


def compiler(compile_command):
    os.system(compile_command)
    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }
    else:
        return True


def coderunner(runner, output_file, temp_output_file):
    print(os.system(runner))
    stat = status()
    print(stat)
    res = None
    if (stat['run_status'] == "OK"):
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


def run_c(f, time, mem, input_file, temp_output_file, output_file):
    language = Programming_Language.objects.get(name="c")
    compile_stat = compiler(language.compile_command.format(f))
    if compile_stat == True:
        runner = language.run_command.format(
            ENGINE_PATH, time, mem, input_file, temp_output_file
        )
        return coderunner(runner, output_file, temp_output_file)
    else:
        return compile_stat


def run_cpp(f, time, mem, input_file, temp_output_file, output_file):
    language = Programming_Language.objects.get(name="c++")
    compile_stat = compiler(language.compile_command.format(f))
    if compile_stat == True:
        runner = language.run_command.format(
            ENGINE_PATH, time, mem, input_file, temp_output_file
        )
        return coderunner(runner, output_file, temp_output_file)
    else:
        return compile_stat

def run_python3(f, time, mem, input_file, temp_output_file, output_file):
    language = Programming_Language.objects.get(name="python3")
    compile_stat = compiler(language.compile_command.format(f))
    if compile_stat == True:
        runner = language.run_command.format(
            ENGINE_PATH, time, mem, f, input_file, temp_output_file
        )
        return coderunner(runner, output_file, temp_output_file)
    else:
        return compile_stat

def run_python2(f, time, mem, input_file, temp_output_file, output_file):
    language = Programming_Language.objects.get(name="python2")
    compile_stat = compiler(language.compile_command.format(f))
    if compile_stat == True:
        runner = language.run_command.format(
            ENGINE_PATH, time, mem, f, input_file, temp_output_file
        )
        return coderunner(runner, output_file, temp_output_file)
    else:
        return compile_stat

def run_java(f, time, mem, input_file, temp_output_file, output_file):
    language = Programming_Language.objects.get(name="java")
    compile_stat = compiler(language.compile_command.format(f))
    if compile_stat == True:
        runner = language.run_command.format(
            ENGINE_PATH, time, mem, os.path.abspath(OUTPATH_DIR), input_file, temp_output_file
        )
        return coderunner(runner, output_file, temp_output_file)
    else:
        return compile_stat