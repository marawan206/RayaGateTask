# Use official PHP image as base from composer.json
FROM php:8.1-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim unzip git curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . /var/www

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Copy existing application directory permissions from the docker\webserver\php.ini file
COPY ./docker/webserver/php.ini /usr/local/etc/php/

###
USER root

COPY ./run.sh /usr/local/bin/run.sh

RUN chmod +x /usr/local/bin/run.sh
### 

USER www-data

EXPOSE 5000

ENTRYPOINT ["/usr/local/bin/run.sh"]