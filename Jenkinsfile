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
  - name: argo
    image: argoproj/argo-cd-ci-builder:latest
    command:
    - cat
    tty: true
  volumes:
    - name: docker-config
      configMap:
        name: docker-config
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
    stage('Change commit to Argo'){
      steps{
        git 'https://github.com/laparman/k8s'
        container(name: 'argo') {
          sh '''
            cd env/dev && kustomize edit set image wonjoyoo/tkg:${BUILD_NUMBER}
            git config --global user.email "wonjoyoo@gmail.com"
            git commit -a -m 'update image tag'
            git push --set-upstream origin master
          '''
        }
      }
    }
  }
}
