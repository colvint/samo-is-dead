#!/bin/sh

# uses Brewfile to install local system dependencies
brew bundle

# steup default mminikube config
minikube config set vm-driver hyperkit
minikube config set memory 8192

# start minikube
minikube start

# install confluent kafka components (connecct, control center, ksql, etc)
helm repo add confluent https://confluentinc.github.io/cp-helm-charts/
helm repo update
helm install $APP_NAME confluent/cp-helm-charts

