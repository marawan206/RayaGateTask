#!/bin/bash

# migrate db solution
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=5000