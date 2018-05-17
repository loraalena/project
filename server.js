var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');


http.createServer(function (request, response) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bank'
    });
    connection.connect();
    console.log('request ', request.url);

    if (request.method == 'POST' && request.url == "/save_clients") {

        var jsonString = '';

        request.on('data', function (data) {
            jsonString += data;
        });

        request.on('end', function () {
            var body = JSON.parse(jsonString);
            //console.log(body);

            var string = "";
            if (body.id) {
                string = "UPDATE clients SET name = '" + body.name + "',surname = '" + body.surname + "',patr = '" + body.patr + "', bday='" +
                    body.bday + "', sex='" + body.a + "',seria = '" + body.seria + "',num ='" + body.num + "', issuedBy='" +
                    body.issued + "', data='" + body.data + "',idPasport = '" + body.num_id + "',birthplace ='" + body.place + "', town='" +
                    body.town + "', address='" + body.address + "',telD = '" + body.td + "',telM ='" + body.tm + "', mail='" +
                    body.mail + "', sityOfReg='" + body.townpr + "',addressOfReg = '" + body.addresspr + "',famStatus ='" + body.fam + "',nation='" +
                    body.nation + "', invalid='" + body.inval + "', pensioner='" + body.b + "', income='" + body.income + "' WHERE id = " + body.id;
            }
            else {

                string = "INSERT clients (name, surname, patr, bday, sex, seria, num, issuedBy, data, idPasport, " +
                    "birthplace, town, address, telD, telM, mail, sityOfReg, addressOfReg, famStatus, nation, invalid, pensioner, income) " +
                    "VALUES('" + body.name + "','" + body.surname + "','" + body.patr + "','" + body.bday + "','" + body.a + "'," +
                    "'" + body.seria + "','" + body.num + "','" + body.issued + "','" + body.data + "','" + body.num_id + "','"
                    + body.place + "','" + body.town + "','" + body.address + "','" + body.td + "','" + body.tm + "','" + body.mail + "','"
                    + body.townpr + "','" + body.addresspr + "','" + body.fam + "','" + body.nation + "','" + body.inval + "','" + body.b + "','" +
                    body.income + "'" + ")";
            }
            var query = connection.query(string, function (error, result) {
                response.end();
                if (error) {
                    console.log(error);
                }
                console.log(result);
            });
        });
        //connection.end();
        return;
    }


    if (request.method == 'POST' && request.url == "/show_clients") {
        var query = connection.query("SELECT * FROM clients ", function (error, result) {
//console.log(result);
            response.end(JSON.stringify(result), 'utf-8');

            if (error) {
                //console.log(error);
            }
        });
        //connection.end();
        return;

    }

    if (request.method == 'POST' && request.url == "/delete_clients") {
        var jsonString = '';

        request.on('data', function (data) {
            jsonString += data;
        });

        request.on('end', function () {
            var body = JSON.parse(jsonString);
            //console.log(body);

            var string = "";


            var query = connection.query("DELETE FROM clients WHERE id=" + body.id, function (error, result) {

                response.end();
                if (error) {
                    console.log(error);
                }
                console.log(result);
            });
        });
        //connection.end();
        return;

    }


    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './front-end/form_ser.html';
    } else {
        filePath = './front-end' + request.url;
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./400.html', function (error, content) {
                    response.writeHead(404, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {

            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
    });

}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');

