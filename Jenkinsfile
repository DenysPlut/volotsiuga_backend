pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = '192.168.56.20:5000'   // ✅ registry на Jenkins VM
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
                sh '''
                    echo "📦 Будуємо Docker-образ: $DOCKER_IMAGE"
                    docker build -t $DOCKER_IMAGE .
                    docker push $DOCKER_IMAGE
                '''
            }
        }

        stage('Deploy with Ansible') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'prod-ssh-key',   // ID ключа в Jenkins Credentials
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        echo "🔧 Запуск Ansible playbook для деплою..."
                        ansible-playbook -i /var/lib/jenkins/ansible/inventory.ini \
                          /var/lib/jenkins/ansible/deploy.yml \
                          --extra-vars "docker_image=$DOCKER_IMAGE" \
                          --user $SSH_USER \
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
