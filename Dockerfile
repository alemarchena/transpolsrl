FROM php:8.1-apache

# Instalar extensiones de PHP
# Asegúrate de que estas extensiones estén instaladas antes de Composer si son necesarias para sus dependencias.
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Instalar dependencias del sistema necesarias para Composer (git, zip, unzip)
# libzip-dev es necesario para la extensión 'zip' de PHP
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/* # Limpiar caché de apt para reducir el tamaño de la imagen

# Instalar la extensión 'zip' de PHP, que es a menudo requerida por Composer
RUN docker-php-ext-install zip

# Instalar Composer
# Copia el binario de Composer desde una imagen oficial de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer el directorio de trabajo dentro del contenedor
# Este será el directorio raíz de tu aplicación PHP
WORKDIR /var/www/html

# Copiar los archivos de tu aplicación desde la carpeta 'server' de tu host
# Asegúrate de que tu 'server' local contenga 'composer.json' y 'composer.lock'
COPY server/ .

# Instalar las dependencias de Composer
# Esto creará la carpeta 'vendor' con todas las librerías necesarias
# --no-dev: No instala dependencias de desarrollo (bueno para producción)
# --optimize-autoloader: Optimiza el autoloader para un mejor rendimiento
RUN composer install --no-dev --optimize-autoloader

# Habilitar el módulo rewrite de Apache (ya lo tenías)
RUN a2enmod rewrite

# Exponer el puerto 80 para Apache
EXPOSE 80