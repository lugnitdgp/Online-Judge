release: python3 manage.py makemigrations && python3 manage.py migrate --run-syncdb
web: gunicorn msntch.wsgi --log-file -