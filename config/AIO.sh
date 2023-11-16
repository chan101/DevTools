export JAVA_HOME=/JDK_PATH
if [ "$1" = "FRONTEND_APPLICATION" ]
then
    if [ "$2" = "Stop" ]
    then
        echo "-----FRONTEND_APPLICATION STOP SCRIPT-----"
		cd /SCRIPTS_PATH
		sh stop.sh -FRONTEND_APPLICATION
		echo "-----FRONTEND_APPLICATION STOP SCRIPT COMPLETED-----"
    elif [ "$2" = "Start" ]
    then
        echo "-----FRONTEND_APPLICATION START SCRIPT-----"
		cd /SCRIPTS_PATH
		sh start.sh -FRONTEND_APPLICATION
		echo "-----FRONTEND_APPLICATION START SCRIPT COMPLETED-----"
    elif [ "$2" = "Restart" ]
    then
        echo "-----FRONTEND_APPLICATION RESTART SCRIPT-----"
		cd /SCRIPTS_PATH
		sh stop.sh -FRONTEND_APPLICATION
		sh start.sh -FRONTEND_APPLICATION
		echo "-----FRONTEND_APPLICATION RESTART SCRIPT COMPLETED-----"
    elif [ "$2" = "Redeploy" ]
    then
        echo "-----FRONTEND_APPLICATION REDEPLOY SCRIPT-----"
		cd /SCRIPTS_PATH
		sh redeploy.sh -FRONTEND_APPLICATION
		echo "-----FRONTEND_APPLICATION REDEPLOY SCRIPT COMPLETED-----"
    elif [ "$2" = "RedeployDebug" ]
    then
        echo "-----FRONTEND_APPLICATION REDEPLOY DEBUG SCRIPT-----"
		cd /SCRIPTS_PATH
		sh redeploy_debug.sh -FRONTEND_APPLICATION
		echo "-----FRONTEND_APPLICATION REDEPLOY DEBUG SCRIPT COMPLETED-----"
    elif [ "$2" = "Deploy" ]
    then
        echo "-----FRONTEND_APPLICATION DEPLOY SCRIPT-----"
		cd /FRONDEND_APPLICATION_WAR_PATH
		str1="ARTIFACTORY_URL"
		str2="/WAR_FILE"
		str3=".war"
		url="$str1$3$str2$3$str3"
		rm WAR_FILE.war_old
		mv WAR_FILE.war WAR_FILE.war_old
		echo "FRONTEND_APPLICATION WAR download started"
		wget $url -O WAR_FILE.war
		echo "FRONTEND_APPLICATION WAR download completed"
		cd /SCRIPTS_PATH
		export JAVA_HOME=/JDK_PATH
		sh redeploy.sh -FRONTEND_APPLICATION
		echo "-----FRONTEND_APPLICATION DEPLOY SCRIPT COMPLETED-----"
    fi
elif [ "$1" = "BACKEND_APPLICATION" ]
then
    if [ "$2" = "Stop" ]
    then
        echo "-----BACKEND_APPLICATION STOP SCRIPT-----"
		cd /SCRIPTS_PATH
		sh stop.sh -BACKEND_APPLICATION
		echo "-----BACKEND_APPLICATION STOP SCRIPT COMPLETED-----"
    elif [ "$2" = "Start" ]
    then
        echo "-----BACKEND_APPLICATION START SCRIPT-----"
		cd /SCRIPTS_PATH
		sh start.sh -BACKEND_APPLICATION
		echo "-----BACKEND_APPLICATION START SCRIPT COMPLETED-----"
    elif [ "$2" = "Restart" ]
    then
        echo "-----BACKEND_APPLICATION RESTART SCRIPT-----"
		cd /SCRIPTS_PATH
		sh stop.sh -BACKEND_APPLICATION
		sh start.sh -BACKEND_APPLICATION
		echo "-----BACKEND_APPLICATION RESTART SCRIPT COMPLETED-----"
    elif [ "$2" = "Redeploy" ]
    then
        echo "-----BACKEND_APPLICATION REDEPLOY SCRIPT-----"
		cd /SCRIPTS_PATH
		sh redeploy.sh -BACKEND_APPLICATION
		echo "-----BACKEND_APPLICATION REDEPLOY SCRIPT COMPLETED-----"
    fi
elif [ "$1" = "REST_API1" ]
then
    if [ "$2" = "Stop" ]
    then
        echo "-----REST_API1 STOP SCRIPT-----"
	 cd REST_API_SCRIPTS
	 sh stop.sh -REST_API1API
	 echo "-----REST_API1 STOP SCRIPT COMPLETED-----"
    elif [ "$2" = "Start" ]
    then
        echo "-----REST_API1 START SCRIPT-----"
	 cd REST_API_SCRIPTS
	 sh start.sh -REST_API1API
	 echo "-----REST_API1 START SCRIPT COMPLETED-----"
    elif [ "$2" = "Restart" ]
    then
        echo "-----REST_API1 RESTART SCRIPT-----"
	 cd REST_API_SCRIPTS
	 sh stop.sh -REST_API1API
	 sh start.sh -REST_API1API
	 echo "-----REST_API1 RESTART SCRIPT COMPLETED-----"

    fi
elif [ "$1" = "REST_API2" ]
then
    if [ "$2" = "Stop" ]
    then
        echo "-----REST_API2 STOP SCRIPT-----"
	 cd REST_API_SCRIPTS
	 sh stop.sh -REST_API2
	 echo "-----REST_API2 STOP SCRIPT COMPLETED-----"
    elif [ "$2" = "Start" ]
    then
        echo "-----REST_API2 START SCRIPT-----"
	 cd REST_API_SCRIPTS
	 sh start.sh -REST_API2
	 echo "-----REST_API2 START SCRIPT COMPLETED-----"
    elif [ "$2" = "Restart" ]
    then
        echo "-----GBPRESTART SCRIPT-----"
	 cd REST_API_SCRIPTS
	 sh stop.sh -REST_API2
	 sh start.sh -REST_API2
	 echo "-----REST_API2 RESTART SCRIPT COMPLETED-----"

    fi
fi