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
        return "Compilation Error"
    else:
        command = "sudo ./safeexec --usage usage.txt --exec python3 " + f + " < " + input_file + " > output_of_" + input_file.split(
            ".")[0] + ".txt"
        os.system(command)
        if (filecmp.cmp(output_file,
                        "output_of_" + input_file.split(".")[0] + ".txt")):
            return "Testcase passed"
        else:
            return "Testcase failed"


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", type=str, help="File for execution")
    parser.add_argument("--input", type=str, help="Input file location")
    parser.add_argument("--output",
                        type=str,
                        help="Expected output file location")
    parser.add_argument("--language",
                        type=str,
                        help="Language to be processed")
    pars = parser.parse_args()

    f = pars.file
    input_file = pars.input
    output_file = pars.output
    language = pars.language
    if language == "c":
        print(run_c(f, input_file, output_file))
    elif language == "cpp":
        print(run_cpp(f, input_file, output_file))
    elif language == "java":
        print(run_java(f, input_file, output_file))
    elif language == "python2":
        print(run_python2(f, input_file, output_file))
    else:
        print(run_python3(f, input_file, output_file))