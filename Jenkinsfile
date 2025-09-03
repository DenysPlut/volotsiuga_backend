pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = '192.168.56.10:5000'
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/volotsiuga:${BUILD_NUMBER}"
    }

    tools {
        nodejs 'node24'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DenysPlut/volotsiuga_backend.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                sh '''
                    docker build -t $DOCKER_IMAGE .
                    docker push $DOCKER_IMAGE
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'prod-kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                        echo "🔧 Updating deployment manifest..."
                        sed -i "s|image:.*|image: $DOCKER_IMAGE|g" k8s/deployment.yaml

                        echo "🚀 Applying manifests..."
                        kubectl --kubeconfig=$KUBECONFIG --insecure-skip-tls-verify=true apply -f k8s/deployment.yaml --validate=false
                        kubectl --kubeconfig=$KUBECONFIG --insecure-skip-tls-verify=true apply -f k8s/service.yaml --validate=false || true
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Деплой у Kubernetes завершено успішно!'
        }
        failure {
            echo '❌ Помилка при деплої.'
        }
    }
}
