#!/bin/sh

# uninstall confluent kafka components (connecct, control center, ksql, etc)
helm delete $APP_NAME
kubectl delete pvc --selector=release=$APP_NAME

# teardown minikube
minikube delete
