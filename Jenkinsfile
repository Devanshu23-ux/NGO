pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  # Node container
  - name: node
    image: node:18
    command: ['cat']
    tty: true

  # Sonar Scanner container
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ['cat']
    tty: true

  # Kubectl container
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
    securityContext:
      runAsUser: 0
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  # Docker-in-Docker with proper registry + daemon config
  - name: dind
    image: docker:24.0.6-dind
    securityContext:
      privileged: true
    tty: true
    args:
      - "--host=tcp://0.0.0.0:2375"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
      - name: docker-graph-storage
        mountPath: /var/lib/docker

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret

  - name: docker-graph-storage
    emptyDir: {}

'''
        }
    }

    stages {

        stage('Prepare NGO Website') {
            steps {
                container('node') {
                    sh '''
                        echo "Static NGO Website"
                        ls -la
                    '''
                }
            }
        }

        stage('Debug Workspace') {
            steps {
                container('node') {
                    sh '''
                        echo "=== WORKSPACE PATH ==="
                        echo $WORKSPACE

                        echo "=== FILES ==="
                        ls -la

                        echo "=== DOCKERFILE ==="
                        sed -n '1,50p' Dockerfile || echo "Dockerfile not found!"
                    '''
                }
            }
        }

        stage('Prepare Base Image in Nexus') {
            steps {
                container('dind') {
                    sh '''
                        export DOCKER_HOST=tcp://localhost:2375

                        echo "Checking nginx:alpine in Nexus..."
                        if docker pull nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/nginx:alpine; then
                          echo "Found in Nexus"
                        else
                          echo "Not found — pushing from Docker Hub..."
                          docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                          docker pull nginx:alpine
                          docker tag nginx:alpine nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/nginx:alpine
                          docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/nginx:alpine
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        export DOCKER_HOST=tcp://localhost:2375

                        echo "=== Building NGO Docker Image ==="
                        docker build -t ngo:latest .
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=2401075-NGO \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                            -Dsonar.login=sqp_08597ce2ed0908d3a22170c3d5269ac22d8d7fcd
                    '''
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        export DOCKER_HOST=tcp://localhost:2375
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                            -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Push NGO Image to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        export DOCKER_HOST=tcp://localhost:2375

                        docker tag ngo:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1
                    '''
                }
            }
        }

        stage('Create Namespace') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl create namespace 2401075 || echo "Namespace exists"
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/deployment.yaml -n 2401075
                        kubectl apply -f k8s/service.yaml -n 2401075

                        kubectl rollout status deployment/engo-connect-deployment -n 2401075
                    '''
                }
            }
        }

        stage('Debug Pods') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get pods -n 2401075
                        kubectl describe pods -n 2401075 | head -n 200
                    '''
                }
            }
        }
    }
}
