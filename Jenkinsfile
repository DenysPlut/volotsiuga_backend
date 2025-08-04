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
                sh '''
                    mkdir -p dist
                    echo "console.log('Hello from Jenkins!')" > dist/index.js
                    echo "=== Build complete ==="
                    ls -la dist
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(['5bcc959c-f4c6-45c4-b4c1-f6689f9494a8']) {
                    sh '''
                        echo "=== Файли в dist перед rsync ==="
                        ls -la dist

                        rsync -avz --delete ./dist/ vagrant@192.168.56.10:/home/vagrant/app/

                        ssh vagrant@192.168.56.10 '
                            cd /home/vagrant/app &&
                            echo "=== Файли на проді ===" &&
                            ls -la dist &&
                            npx pm2 restart app-name || npx pm2 start dist/index.js --name app-name
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
