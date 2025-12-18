// pipeline {
//     agent {
//         kubernetes {
//             yaml '''
// apiVersion: v1
// kind: Pod
// spec:
//   containers:

//   - name: node
//     image: node:18
//     command: ['cat']
//     tty: true

//   - name: sonar-scanner
//     image: sonarsource/sonar-scanner-cli
//     command: ['cat']
//     tty: true

//   - name: kubectl
//     image: bitnami/kubectl:latest
//     command: ['cat']
//     tty: true
//     securityContext:
//       runAsUser: 0
//       readOnlyRootFilesystem: false
//     env:
//     - name: KUBECONFIG
//       value: /kube/config
//     volumeMounts:
//     - name: kubeconfig-secret
//       mountPath: /kube/config
//       subPath: kubeconfig

//   - name: dind
//     image: docker:dind
//     args: ["--storage-driver=overlay2", "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"]
//     securityContext:
//       privileged: true
//     env:
//     - name: DOCKER_TLS_CERTDIR
//       value: ""

//   volumes:
//   - name: kubeconfig-secret
//     secret:
//       secretName: kubeconfig-secret
// '''
//         }
//     }

//     // *** ADDED ***
//     environment {
//         SONAR_HOST = "http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000"
//         SONAR_AUTH = "sqp_58c9af5218f55043dfb036706306c59ea443b889"
//     }

//     stages {
//     stage('Checkout') {
//             steps {
//                 git url:'https://github.com/Devanshu23-ux/NGO.git',branch:'main'
//             }
//         }


//         /* -------------------------
//            STATIC WEBSITE STEP
//            ------------------------- */
//         stage('Prepare NGO Website') {
//             steps {
//                 container('node') {
//                     sh '''
//                         echo "NGO website – static HTML/CSS site"
//                         echo "Listing project files..."
//                         ls -la
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            DOCKER BUILD
//            ------------------------- */
//         stage('Build Docker Image') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         sleep 10
//                         echo "=== Building NGO Docker Image ==="
//                         docker build -t ngo:latest .
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            SONARQUBE ANALYSIS
//            ------------------------- */
//         stage('SonarQube Analysis') {
//             steps {
//                 container('sonar-scanner') {

//                     // *** ADDED: VALIDATE REACHABILITY BEFORE RUNNING ***
//                     sh '''
//                         echo "Checking SonarQube reachability..."
//                         curl -I ${SONAR_HOST} || echo "SonarQube not reachable, but running scanner anyway."
//                     '''

//                     sh '''
//                         sonar-scanner \
//                         -Dsonar.projectKey=2401075- \
//                         -Dsonar.sources=. \
//                         -Dsonar.host.url=${SONAR_HOST} \
//                         -Dsonar.token=${SONAR_AUTH}

                        
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            DOCKER LOGIN TO NEXUS
//            ------------------------- */
//         stage('Login to Nexus Registry') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         echo "Logging in to Nexus Docker Registry..."
//                         docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
//                           -u student -p Imcc@2025
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            PUSH IMAGE TO NEXUS
//            ------------------------- */
//         stage('Push NGO Image to Nexus') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         echo "Tagging NGO image..."
//                         docker tag ngo:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1

//                         echo "Pushing NGO image to Nexus..."
//                         docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            CREATE NAMESPACE
//            ------------------------- */
//         stage('Create Namespace') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         echo "Creating namespace 2401075 if not exists..."
//                         kubectl create namespace 2401075 || echo "Namespace already exists"
//                         kubectl get ns
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            DEPLOY TO KUBERNETES
//            ------------------------- */
//         stage('Deploy to Kubernetes') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         echo "Applying NGO Kubernetes Deployment & Service..."

//                         kubectl apply -f k8s/deployment.yaml -n 2401075
//                         kubectl apply -f k8s/service.yaml -n 2401075

//                         echo "Checking all resources..."
//                         kubectl get all -n 2401075

//                         echo "Waiting for rollout..."
//                         kubectl rollout status deployment/engeo-frontend-deployment -n 2401075 --timeout=120s
 
//                     '''
//                 }
//             }
//         }

//         /* -------------------------
//            DEBUG
//            ------------------------- */
//         stage('Debug Pods') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         echo "[DEBUG] Listing Pods..."
//                         kubectl get pods -n 2401075

//                         echo "[DEBUG] Describe Pods..."
//                         kubectl describe pods -n 2401075 | head -n 200
//                     '''
//                 }
//             }
//         }
//     }
// }



pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
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
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        SONAR_HOST = 'http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Building NGO Docker image..."
                        sleep 15
                        docker build -t ngo:latest .
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([
                        string(credentialsId: 'sonartoken-2401075', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401075_ngo \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions=node_modules/**,dist/** \
                              -Dsonar.host.url=${SONAR_HOST} \
                              -Dsonar.token=${SONAR_TOKEN}
                        '''
                    }
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker --version
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                          -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ngo:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1

                        docker push \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401075_ngo/ngo:v1

                        docker image ls
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    dir('k8s-deployment') {
                        sh '''
                            echo "Deploying NGO application to Kubernetes..."

                            kubectl apply -f deployment.yaml -n 2401075
                            kubectl apply -f service.yaml -n 2401075

                            kubectl rollout status deployment/engeo-frontend-deployment \
                              -n 2401075 --timeout=120s
                        '''
                    }
                }
            }
        }
    }
}
