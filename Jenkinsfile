pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DenysPlut/volotsiuga_backend.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm install $NODE_VERSION
                nvm use $NODE_VERSION
                node -v
                npm -v
                '''
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
                sh 'npm run build'
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(['5bcc959c-f4c6-45c4-b4c1-f6689f9494a8']) {
                    sh '''
                    echo "📦 Deploying to 192.168.56.10..."

                    # Копіюємо білд
                    rsync -avz --delete ./dist/ user@192.168.56.10:/home/user/app/

                    # Перезапускаємо або запускаємо з pm2
                    ssh user@192.168.56.10 '
                        cd /home/user/app &&
                        pm2 restart app-name || npx pm2 start dist/index.js --name app-name 
                    '
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Успішно завершено!'
        }
        failure {
            echo '❌ Помилка під час виконання.'
        }
    }
}
