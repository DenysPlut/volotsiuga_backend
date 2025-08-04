pipeline {
    agent any

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

        stage('Build') {
            steps {
                echo 'No build needed – plain Node.js app'
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(['5bcc959c-f4c6-45c4-b4c1-f6689f9494a8']) {
                    sh '''
                    echo "=== Копіюємо проект на прод ==="
                    rsync -avz --delete --exclude=".git" ./ vagrant@192.168.56.10:/home/vagrant/app/

                    echo "=== Перезапускаємо backend через PM2 ==="
                    ssh vagrant@192.168.56.10 '
                        cd /home/vagrant/app &&
                        npm install &&
                        npx pm2 restart backend-app || npx pm2 start src/server.js --name backend-app
                    '
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
