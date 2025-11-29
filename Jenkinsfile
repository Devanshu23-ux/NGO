pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: node
    image: node:18
    command: ['cat']
    tty: true

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ['cat']
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    args: ["--storage-driver=overlay2", "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"]
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        SONAR_HOST = "http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000"
    }

    stages {

        /* -------------------------
           CHECKOUT CODE
           ------------------------- */
        stage('Checkout') {
            steps {
                git url:'https://github.com/Devanshu23-ux/NGO.git', branch:'main'
            }
        }

        /* -------------------------
           STATIC WEBSITE (NO BUILD)
           ------------------------- */
        stage('Prepare Static Files') {
            steps {
                container('node') {
                    sh '''
                        echo "NGO website – static HTML/CSS site"
                        echo "Listing project files..."
                        ls -la
                    '''
                }
            }
        }

        /* -------------------------
           DOCKER BUILD
           ------------------------- */
        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Waiting for Docker daemon..."
                        sleep 15

                        echo "Building NGO Docker Image..."
                        docker build -t ngo:latest .
                    '''
                }
            }
        }

        /* -------------------------
           SONARQUBE ANALYSIS
           ------------------------- */
        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            echo "Checking SonarQube reachability..."
                            curl -I ${SONAR_HOST} || echo "SonarQube not reachable, but scanning anyway."

                            sonar-scanner \
                              -Dsonar.projectKey=2401075-IntroConnect \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=${SONAR_HOST} \
                              -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        /* -------------------------
           LOGIN TO NEXUS
           ------------------------- */
        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        echo "Logging into Nexus Registry..."
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                          -u student -p Imcc@2025
                    '''
                }
            }
        }

        /* -------------------------
           PUSH IMAGE TO NEXUS
           ------------------------- */
        stage('Push to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        echo "Tagging NGO image..."
                        docker tag ngo:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1

                        echo "Pushing NGO image to Nexus..."
                        docker push \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1
                    '''
                }
            }
        }

        /* -------------------------
           CREATE NAMESPACE
           ------------------------- */
        stage('Create Namespace') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "Ensuring namespace 2401075 exists..."
                        kubectl create namespace 2401075 || echo "Namespace already exists"
                    '''
                }
            }
        }

        /* -------------------------
           DEPLOY TO KUBERNETES
           ------------------------- */
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "Deploying NGO application..."

                        kubectl apply -f k8s/deployment.yaml -n 2401075
                        kubectl apply -f k8s/service.yaml -n 2401075

                        echo "Resources in namespace:"
                        kubectl get all -n 2401075

                        echo "Waiting for rollout..."
                        kubectl rollout status deployment/engeo-frontend-deployment -n 2401075 --timeout=120s
                    '''
                }
            }
        }

        /* -------------------------
           DEBUG IMAGE PULL
           ------------------------- */
        stage('Debug Pod Image Pull') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "===== Describe NGO pod ====="
                        kubectl describe pod -l app=ngo -n 2401075 || true

                        echo ""
                        echo "===== Last events ====="
                        kubectl get events -n 2401075 --sort-by=.lastTimestamp | tail -n 20 || true
                    '''
                }
            }
        }

        /* -------------------------
           CLUSTER INFO
           ------------------------- */
        stage('Show Cluster Nodes & Services') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "===== Kubernetes Nodes ====="
                        kubectl get nodes -o wide

                        echo ""
                        echo "===== Services in namespace 2401075 ====="
                        kubectl get svc -n 2401075
                    '''
                }
            }
        }
    }
}
