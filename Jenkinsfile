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
    stage('Commit change to Argo'){
      steps{
        container(name: 'argo') {
          checkout([$class: 'GitSCM',
                        branches: [[name: '*/master' ]],
                        extensions: scm.extensions,
                        userRemoteConfigs: [[
                            url: 'git@github.com:laparman/k8s.git',
                            credentialsId: 'jenkins-ssh-private',
                        ]]
                ])
           sshagent(credentials: ['jenkins-ssh-private']){
             sh("""
               #!/usr/bin/env bash
               set +x
               ls -al
               export GIT_SSH_COMMAND="ssh -oStrictHostKeyChecking=no"
               git config --global user.email "wonjoyoo@gmail.com"
               git checkout master
               cd env/dev && kustomize edit set image wonjoyoo/tkg:${BUILD_NUMBER}
               git commit -a -m 'update image tag'
               git push --set-upstream origin master
              """)
           }
        }
      }
    }
  }
}
