FROM openjdk:latest
COPY . /home/ubuntu/java
WORKDIR /home/ubuntu/java
RUN javac Main.java
CMD cat input.txt | java Main