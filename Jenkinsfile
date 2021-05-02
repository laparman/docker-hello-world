pipeline {
  agent {
    kubernetes {
      //cloud 'kubernetes'
      yaml """
kind: Pod
metadata:
  name: kaniko
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug-539ddefcae3fd6b411a95982a830d987f4214251
    imagePullPolicy: Always
    command:
    - cat
    tty: true
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker
  volumes:
    - name: docker-config
      configMap:
        name: docker-config
---        
kind: Pod
metadata:
  name: argo
spec:
  containers:
  - name: argo
    image: argoproj/argo-cd-ci-builder:latest
    command:
    - cat
    tty: true
"""
    }
  }
  stages {
    stage('Build with Kaniko') {
      steps {
        git 'https://github.com/laparman/docker-hello-world'
        container(name: 'kaniko') {
            sh '''
            /kaniko/executor --dockerfile `pwd`/Dockerfile --context `pwd` --destination=wonjoyoo/tkg:v$BUILD_NUMBER
            '''
        }
      }
    }
  }
}
