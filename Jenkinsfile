pipeline {
    agent any

    environment {
        NODE_VERSION = '18'  // версія Node.js, яку треба ставити
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DenysPlut/volotsiuga_backend.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                // Встановлюємо Node.js (через nvm або NodeJS Plugin у Jenkins)
                sh """
                . ~/.nvm/nvm.sh
                nvm install $NODE_VERSION
                nvm use $NODE_VERSION
                node -v
                npm -v
                """
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test' // якщо немає тестів, можна прибрати цей stage
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // якщо в package.json є build-скрипт
            }
        }

        stage('Start') {
            steps {
                echo '🚀 Starting application...'
                sh 'npm start &'
            }
        }
    }

    post {
        success {
            echo '✅ Build успішно завершено!'
        }
        failure {
            echo '❌ Build провалився!'
        }
    }
}
