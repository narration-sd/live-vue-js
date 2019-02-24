#!/bin/bash
(cd /var/www/narrationsd; ls)
(cd ~/var/www/lv-gatsby; cp -r public /var/www/staging)
(cd ~/var/www/lv-gatsby; cp -r config /var/www/staging)
ls -l /var/www/staging
