import argparse
import subprocess
import os
import filecmp

def run(f, input_file, output_file):
    compilation = "python -m py_compile " + f + " &> compile_log"
    os.system(compilation)
    if(os.stat("compile_log").st_size != 0):
        return "Compilation Error"
    else:
        command = "./safeexec --usage usage.txt --exec python3 " + f + " < " + input_file + " > output_of_" + input_file.split(".")[0] + ".txt"
        os.system(command)
        if(filecmp.cmp(output_file, "output_of_" + input_file.split(".")[0] + ".txt")):
            return "Testcase passed"
        else:
            return "Testcase failed"

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", type=str, help="File for execution")
    parser.add_argument("--input", type=str, help="Input file location")
    parser.add_argument("--output", type=str, help="Expected output file location")
    pars = parser.parse_args()

    f = pars.file
    input_file = pars.input
    output_file = pars.output
    print(run(f, input_file, output_file))