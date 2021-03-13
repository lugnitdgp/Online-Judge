<p align="center">
  <a href="#">
    <img alt="logo" src=".github/images/oj.png" width="140" />
  </a>
</p>

![Django CI](https://github.com/himanshu272/Online-Judge/workflows/Django%20CI/badge.svg)

# Online-Judge
Port of the Online Judge in Python

## Architecture
<p align="center">
    <img alt="logo" src=".github/images/ojarch.png" style="max-width:1200px;" />
</p>

## Working

Initially the user chooses a language in the code editor and starts to write the answer based on the coding question. When the user submits the answer, the answer passes to the server. In the server a task id is being created in the PostgreSQL and the job is being sent to the RabbitMQ/Redis message queue. Then celery picks up the job and executes it in a sandbox environment which is developed using C. This helps to increase security and prevents malicious code injection attacks on the platform. When the job finishes execution the result is sent to the frontend using long poling. In this way the system verifies the users code, evaluate it and generates it ranking based on scores from other peers.

You can check out the code executor part of the project [here](https://github.com/lugnitdgp/OJ_CodeExecutor).
## Documentation to help with Celery
https://docs.celeryproject.org/en/stable/getting-started/next-steps.html#next-steps

## Documentation to help setting up public PostgreSQL
https://blog.logrocket.com/setting-up-a-remote-postgres-database-server-on-ubuntu-18-04/

## Development Environment Config
This project uses PEP8 code style, please make sure to follow. Yapf is our preffered formatting tool.
If you are using VSCode add the following in your *settings.json* 
```
"python.formatting.provider": "yapf",
"python.formatting.yapfArgs": ["--style={based_on_style: pep8, indent_width: 4, column_limit: 120}"],
"python.linting.enabled": true
```
## Message Broker setup
This project uses RabbitMQ as the primary option for implementing the message broker service. To set it up you need to have Docker on your system:

Instructions to set up Docker are [here](https://docs.docker.com/engine/install/ubuntu/)

To pull Rabbit mq, run ``sudo docker pull rabbitmq`` in the terminal.

We use the Management plugin version of RabbitMQ, so to do that run:
``sudo docker run -d -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER={{ your_custom_user }} -e RABBITMQ_DEFAULT_PASS={{ your_custom_password }} rabbitmq:3-management``

Check the management console at `http://host-ip:15672/` to see if the broker server is running fine.

This will generate a broker-url of the format `amqp://{user}:{password}@{your_ip}:5672/`. Add this as the `CELERY_BROKER_URL` in the `.env` file for the project as well as the executors.

## Second alternative to RabbitMQ - REDIS - (long connections cause problem)
For the code execution part to function properly, you need to install a broker. Steps to install redis are as follows:

1. `sudo apt install redis-server`
2. `sudo nano /etc/redis/redis.conf`
3. Inside the file find the `supervised` directive and change it to `systemd`. It should be set to `no` by default.
  ```
    ...
    supervised systemd
    ...
  ```
4. `sudo systemctl restart redis.service`
5. Add `redis://localhost:6379` in the `CELERY_BROKER_URL` part of the `.env` file you have in your locally cloned repository.

To check if redis is working or not:

1. Type in `redis-cli`
2. Type `ping`
3. If it returns `PONG`, then your redis-broker server is running fine.

## Documentation to help setting up public Redis
https://linuxize.com/post/how-to-install-and-configure-redis-on-ubuntu-18-04/ \
https://www.w3resource.com/redis/redis-auth-password.php

To add Language models after running SQL migrations run 
```bash
python manage.py loaddata --app interface language_model.json
```