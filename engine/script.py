import argparse
import subprocess
import os
import filecmp
from judge.settings import ENGINE_PATH, OUTPATH_DIR
from interface.models import Programming_Language
import json


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


def run(f, time, mem, input_file, temp_output_file, output_file, lang):
    language = Programming_Language.objects.get(name=lang)
    os.system(language.compile_command.format(f))

    if (os.stat("compile_log").st_size != 0):
        with open("compile_log", "r+") as temp_file:
            return {  # Compilation Error
                "code": 1,
                "message": temp_file.read()
            }

    else:
        params = {
            "engine_path": ENGINE_PATH, "time": time, "mem": mem, "f": f,
            "outpath": os.path.abspath(OUTPATH_DIR),
            "in_file": input_file, "temp_out_file": temp_output_file
        }
        runner = language.run_command.format(**params)
        os.system(runner)
        stat = status()
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
