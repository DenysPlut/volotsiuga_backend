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
                sh 'npm ci'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login $DOCKER_REGISTRY -u $DOCKER_USER --password-stdin
                        docker build -t $DOCKER_IMAGE .
                        docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'prod-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        echo "🔧 Запуск Ansible playbook для деплою..."
                        ansible-playbook -i ansible/inventory ansible/deploy.yml \
                          --extra-vars "docker_image=$DOCKER_IMAGE" \
                          --key-file $SSH_KEY
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Деплой завершено успішно!'
        }
        failure {
            echo '❌ Помилка при деплої.'
        }
    }
}
