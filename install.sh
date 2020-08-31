sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install python3.6
sudo apt install g++ -y
sudo apt install default-jre -y
sudo apt-get -y install python3-pip
sudo apt-get install python3-venv -y
sudo python3 -m venv env
source ./env/bin/activate
sudo pip3 install -r requirements.txt
cp .env.example .env
celery -A  judge worker -l info
