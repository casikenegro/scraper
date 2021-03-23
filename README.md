# StreamingScraping.

script para hacer webscraping de la pagina https://agents.redfigures.ag.

para instalar debe tener instalado nodejs

comando para instalar: npm install ó yarn install

para configurar el entorno debe crear un archivo .env en la raiz del proyecto, puede copiar el .env.example existente.

la configuracion de las variables de entorno es la siguiente.

AG_TO_IGNORE: agencias que se desean ignorar separadas por comas.

AG_REQUIREMENTS: los datos correspondientes que se desean guardar (el orden es el establecido).

AG_USERNAME: usuario de la cuenta.

AG_PASSWORD: contraseña de la cuenta.

AG_FILE_NAME: nombre del archivo, por defecto es "data".

la extension del archivo generado es .xlsx
