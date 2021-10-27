#!/bin/bash

#sed -i "s/http:\/\/localhost:8000\/api/\/api/" .env
#npm run build
#git checkout -- .env
scp -r dist web:
ssh web "sudo /bin/bash /home/ns/bin/apply_djing_ui.sh"
