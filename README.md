Basic usage how-to:

Run mongodb on `port:27017` and create database `test1`. Import all collections.

Configure apache:
Enable two modules `mod_proxy` and `mod_proxy_http`. After add virtual host:

```
Example:

<VirtualHost 127.0.0.1>
    ServerAdmin admin@admin.com
    ServerName kent.com.ua:8000
    ServerAlias www.kent.com.ua:8000
 
    ProxyRequests off
 
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
 
    <Location />
        ProxyPass http://localhost:8000/
        ProxyPassReverse http://localhost:8000/
    </Location>
</VirtualHost>

```
Run nodejs:

```
node app.js

```
browse `kent.com.ua:8000`
